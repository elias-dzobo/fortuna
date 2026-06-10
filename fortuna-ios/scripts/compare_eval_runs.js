#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Usage: node scripts/compare_eval_runs.js <quantized_run.json> <fp32_run.json>');
  process.exit(1);
}

function readJson(filePath) {
  const abs = path.resolve(filePath);
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function toMapById(cases) {
  const map = new Map();
  for (const c of cases || []) {
    map.set(c.id, c);
  }
  return map;
}

if (process.argv.length < 4) usage();

const quantized = readJson(process.argv[2]);
const fp32 = readJson(process.argv[3]);

const qCases = quantized.cases || [];
const fCases = fp32.cases || [];
const qMap = toMapById(qCases);
const fMap = toMapById(fCases);
const sharedIds = [...qMap.keys()].filter((id) => fMap.has(id));

if (sharedIds.length === 0) {
  console.error('No shared case ids found between runs.');
  process.exit(2);
}

const qLatencies = [];
const fLatencies = [];
const qTokens = [];
const fTokens = [];
const qKeyword = [];
const fKeyword = [];
const perCaseRows = [];

for (const id of sharedIds) {
  const q = qMap.get(id);
  const f = fMap.get(id);
  qLatencies.push(Number(q.latencyMs || 0));
  fLatencies.push(Number(f.latencyMs || 0));
  qTokens.push(Number(q.generatedTokenCount || 0));
  fTokens.push(Number(f.generatedTokenCount || 0));
  qKeyword.push(Number(q.keywordHitRate || 0));
  fKeyword.push(Number(f.keywordHitRate || 0));

  perCaseRows.push({
    id,
    qLatency: Number(q.latencyMs || 0),
    fLatency: Number(f.latencyMs || 0),
    qKeyword: Number(q.keywordHitRate || 0),
    fKeyword: Number(f.keywordHitRate || 0),
  });
}

const qAvgLatency = mean(qLatencies);
const fAvgLatency = mean(fLatencies);
const qAvgTokens = mean(qTokens);
const fAvgTokens = mean(fTokens);
const qAvgKeyword = mean(qKeyword);
const fAvgKeyword = mean(fKeyword);

const qFasterPct = (fAvgLatency - qAvgLatency) / Math.max(fAvgLatency, 1);
const qualityDeltaPct = qAvgKeyword - fAvgKeyword;

console.log('\nModel Comparison');
console.log('================');
console.log(`Quantized model: ${quantized.modelFilename || 'unknown'}`);
console.log(`FP32 model:      ${fp32.modelFilename || 'unknown'}`);
console.log(`Shared cases:    ${sharedIds.length}`);

console.log('\nAggregate');
console.log('---------');
console.log(`Quantized avg latency: ${qAvgLatency.toFixed(1)} ms`);
console.log(`FP32 avg latency:      ${fAvgLatency.toFixed(1)} ms`);
console.log(`Latency delta:         ${(qFasterPct * 100).toFixed(1)}% (positive => quantized faster)`);
console.log(`Quantized avg tokens:  ${qAvgTokens.toFixed(1)}`);
console.log(`FP32 avg tokens:       ${fAvgTokens.toFixed(1)}`);
console.log(`Quantized keyword hit: ${(qAvgKeyword * 100).toFixed(1)}%`);
console.log(`FP32 keyword hit:      ${(fAvgKeyword * 100).toFixed(1)}%`);
console.log(`Quality delta:         ${(qualityDeltaPct * 100).toFixed(1)} pts (quantized - fp32)`);

console.log('\nPer-case');
console.log('--------');
for (const row of perCaseRows) {
  console.log(
    `${row.id.padEnd(18)} ` +
      `lat(ms) q:${row.qLatency.toFixed(0).padStart(5)} fp32:${row.fLatency.toFixed(0).padStart(5)} | ` +
      `kw-hit q:${(row.qKeyword * 100).toFixed(0).padStart(3)}% fp32:${(row.fKeyword * 100).toFixed(0).padStart(3)}%`
  );
}

