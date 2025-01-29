const fs = require('fs');
const express = require('express');
const { spawn } = require('child_process');

function runTechscript(file) {
    const code = fs.readFileSync(file, 'utf8');

    // Cek apakah ada Python code
    const pythonMatch = code.match(/<python>([\s\S]*?)<\/python>/);
    if (pythonMatch) {
        const pythonCode = pythonMatch[1];
        fs.writeFileSync('server.py', pythonCode);
        const pythonProcess = spawn('python', ['server.py']);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });
    }

    // Jalankan server Express.js
    const app = express();
    app.get('/', (req, res) => {
        res.send(code);
    });

    app.listen(3000, () => {
        console.log('Techscript running at http://localhost:3000');
    });
}

// Ambil file dari argument CMD
const fileName = process.argv[2];
if (fileName) {
    runTechscript(fileName);
} else {
    console.log("Usage: node techscript.js example.tes");
}
