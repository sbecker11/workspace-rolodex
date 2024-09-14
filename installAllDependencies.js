const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const installDependencies = (relativeFilePath, destinationObject) => {
  const absoluteFilePath = path.resolve(__dirname, relativeFilePath);
  const dependencies = JSON.parse(fs.readFileSync(absoluteFilePath, 'utf8'));

  const install = (deps, dev = false) => {
    const depStrings = Object.entries(deps).map(([name, version]) => `${name}@${version}`);
    if (depStrings.length > 0) {
      const devFlag = dev ? '--save-dev' : '';
      execSync(`npm install ${depStrings.join(' ')} ${devFlag}`, { stdio: 'inherit' });
    }
  };

  if (dependencies.dependencies) {
    install(dependencies.dependencies);
  }

  if (dependencies.devDependencies) {
    install(dependencies.devDependencies, true);
  }

  // Update the destination object with the installed dependencies
  destinationObject.dependencies = dependencies.dependencies || {};
  destinationObject.devDependencies = dependencies.devDependencies || {};
};

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const installDependencies = (relativeFilePath, destinationObject) => {
  const absoluteFilePath = path.resolve(__dirname, relativeFilePath);
  const dependencies = JSON.parse(fs.readFileSync(absoluteFilePath, 'utf8'));

  const install = (deps, dev = false) => {
    const depStrings = Object.entries(deps).map(([name, version]) => `${name}@${version}`);
    if (depStrings.length > 0) {
      const devFlag = dev ? '--save-dev' : '';
      execSync(`npm install ${depStrings.join(' ')} ${devFlag}`, { stdio: 'inherit' });
    }
  };

  if (dependencies.dependencies) {
    install(dependencies.dependencies);
  }

  if (dependencies.devDependencies) {
    install(dependencies.devDependencies, true);
  }

  // Update the destination object with the installed dependencies
  destinationObject.dependencies = dependencies.dependencies || {};
  destinationObject.devDependencies = dependencies.devDependencies || {};
};


// Example usage
// const destinationObject = {};
// installDependencies('./dependencies.json', destinationObject);
// console.log('Installed dependencies:', destinationObject);