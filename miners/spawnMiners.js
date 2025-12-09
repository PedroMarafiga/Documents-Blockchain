const spawn = require("child_process").spawn;

function startMiner(id) {
  const miner = spawn("node", ["miner.js", `--id=${id}`], { stdio: "inherit" });
  console.log(`Minerador ${id} iniciado`);
}

for (let i = 1; i <= 3; i++) {
  startMiner(`miner-${i}`);
}
