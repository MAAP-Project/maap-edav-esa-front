/**
 * Link libraries in global node_modules previously linked using npm link.
 * Use this script instead of 'npm link [package]' to prevent issues with dependencies removal
 * and package(-lock).json updates on latest npm versions
 */

 const { exec } = require('child_process');
 const { promisify } = require('util');
 const rimraf = require('rimraf');
 const fs = require('fs');

 async function main() {

    const deps = process.argv.slice(2);

    const execAsync = promisify(exec);
    const { stdout: globalNodeModules } = await execAsync("npm root -g");
    let { stdout: localNodeModules } = await execAsync("npm root");

    const globalModulesLocation = `${globalNodeModules.replace(/\s*/g, '')}`;
    const localModulesLocation = `${localNodeModules.replace(/\s*/g, '')}`;

    deps.forEach((dep) => {
        rimraf(`${localModulesLocation}/${dep}`, () => {
            fs.symlink(`${globalModulesLocation}/${dep}`, `${localModulesLocation}/${dep}`, 'junction', (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`${dep} succesfully linked`);
                }
            });
        })
    });

 }

 if (require.main === module) {
     main();
 }
