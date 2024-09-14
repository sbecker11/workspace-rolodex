const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const installDependencies = (relativeFilePath, destinationObject) => {
  console.log(`welcome to function installDependencies()`);
  console.log(`relativeFilePath: ${relativeFilePath}`);
  console.log(`destinationObject: ${destinationObject}`);

  const absoluteFilePath = path.resolve(__dirname, relativeFilePath);
  console.log(`absoluteFilePath: ${absoluteFilePath}`);

  const dependencies = JSON.parse(fs.readFileSync(absoluteFilePath, 'utf8'));
  console.log(`dependencies: ${dependencies}`);

  const install = (deps, dev = false) => {
    const depStrings = Object.entries(deps).map(([name, version]) => `${name}@${version}`);
    if (depStrings.length > 0) {
      const devFlag = dev ? '--save-dev' : '';
      let cmd = `npm install ${depStrings.join(' ')} ${devFlag}`;
      let flags = { stdio: 'inherit' };
      console.log(`execSync(${cmd},${flags});`);
      execSync(cmd, flags);
    } else {
      console.error("zero depStrings");
    }
  };

  if (dependencies.dependencies) {
    console.log(`installing ${Object.keys(dependencies.dependencies).length} dependencies`);
    install(dependencies.dependencies);
  } else {
    console.log(`installing zero dependencies`);
  }

  if (dependencies.devDependencies) {
    console.log(`installing ${Object.keys(dependencies.devDependencies).length} devDependencies`);
    install(dependencies.devDependencies, true);
  } else {
    console.log(`installing zero devDependencies`);
  }

  // Update the destination object with the installed dependencies
  destinationObject.dependencies = dependencies.dependencies || {};
  console.log(`installed ${Object.keys(destinationObject.dependencies).length} dependencies`);

  destinationObject.devDependencies = dependencies.devDependencies || {};
  console.log(`installed ${Object.keys(destinationObject.devDependencies).length} devDependencies`);
};

// Execute the script
const destinationObject = {};
installDependencies('./all-dependencies.json', destinationObject);
console.log('Installed dependencies:', destinationObject);