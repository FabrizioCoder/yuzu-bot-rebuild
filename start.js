#!usr/bin/envnode
import child_process from "child_process";
const text = String.raw `
 __  __   __  __   ______   __  __   ______   __  __ 
/\ \_\ \ /\ \/\ \ /\___  \ /\ \/\ \ /\  __ \ /\ \/\ \   
\ \____ \\ \ \_\ \\/_/  /__\ \ \_\ \\ \  __< \ \ \_\ \  
 \/\_____\\ \_____\ /\_____\\ \_____\\ \_\ \_\\ \_____\ 
  \/_____/ \/_____/ \/_____/ \/_____/ \/_/ /_/ \/_____/ 
`;

console.group();
    console.log('\x1b[36m%s\x1b[0m', text);
console.groupEnd();

try {
    console.log('\x1b[32m%s\x1b[0m', 'please be patient this may take a while...');
    child_process.execSync('tsc && node built/index.js', { cwd: new URL('.', import.meta.url), stdio: 'inherit' });
}
catch (err) {
    throw new Error(err);
}