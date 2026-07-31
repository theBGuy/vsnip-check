// Guard floor for the ReDoS canaries: `node --test <glob>` exits 0 when the glob matches
// NOTHING, so a tsconfig outDir/rootDir/exclude change could silently disarm the whole test
// suite while CI stays green. Fail loudly instead.
const { globSync } = require("node:fs");

const found = globSync("dist/test/**/*.test.js");
if (found.length === 0) {
  console.error("check-tests-compiled: no compiled tests under dist/test/ - the test run would be a silent no-op (did outDir/rootDir/exclude change?)");
  process.exit(1);
}
console.log(`check-tests-compiled: ${found.length} compiled test file(s) found`);
