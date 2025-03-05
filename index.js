import * as core from "@actions/core";
import * as exec from "@actions/exec";
import fs from "fs";

async function checkIfEndpointExists(
    endpointName, resourceGroup, workspaceName
) {
    /**
     * Check if the endpoint exists in the specified resource group and workspace.
     * @param {string} endpointName - The name of the endpoint.
     * @param {string} resourceGroup - The name of the resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @return {boolean} - Returns true if the endpoint exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the endpoint exists
        await exec.exec(`az ml online-endpoint show --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName}`, [], options);

        console.log("✅ Endpoint already exists. Output:", output);
        return true; // If the command succeeds, the endpoint exists
    } catch (error) {
        return false; // If the command fails, the endpoint does not exist
    }
}

async function checkIfResourceGroupExists(resourceGroup) {
    /**
     * Check if the resource group exists.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the resource group exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };
        // Execute the Azure CLI command
        await exec.exec(`az group show --name ${resourceGroup} --resource-group ${resourceGroup}`, [], options);

        console.log("✅ Resource Group Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Resource Group Not Found or Error Occurred:", errorOutput || error.message
        );
        return false; // Return false if the workspace does not exist
    }
}

async function checkIfWorkspaceExists(workspaceName, resourceGroup) {
    /**
     * Check if the workspace exists in the specified resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the workspace exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the workspace exists
        await exec.exec(`az ml workspace show --name ${workspaceName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Resource Group Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Resource Group Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

async function updateDeploymentTraffic(
    resourceGroup, workspaceName, endpointName, deploymentName, traffic) {
    /**
     * Update the traffic for the specified deployment.
     * @param {string} resourceGroup - The name of the resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} endpointName - The name of the endpoint.
     * @param {string} deploymentName - The name of the deployment.
     * @param {string} traffic - The traffic configuration in JSON format.
     * @return {Promise<boolean>} - Returns a promise that resolves to true if the traffic is updated successfully, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Update the traffic
        await exec.exec(`az ml online-endpoint update --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName} --traffic "${deploymentName}"="${traffic}"`, [], options);
        console.log("✅ Traffic updated successfully. Output:", output);
        return true;
    } catch (error) {
        console.log("❌ Traffic update failed. Error:", errorOutput || error.message);
        return false;
    }
}

async function updateDeploymentMirrorTraffic(
    resourceGroup, workspaceName, endpointName, deploymentName, traffic
) {
    /**
     * Update the mirror traffic for the specified deployment.
     * @param {string} resourceGroup - The name of the resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} endpointName - The name of the endpoint.
     * @param {string} deploymentName - The name of the deployment.
     * @param {string} traffic - The mirror traffic configuration in JSON format.
     * @return {Promise<boolean>} - Returns a promise that resolves to true if the mirror traffic is updated successfully, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Update the mirror traffic
        await exec.exec(`az ml online-endpoint update --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName} --mirror-traffic "${deploymentName}"="${traffic}"`, [], options);
        console.log("✅ Mirror Traffic updated successfully. Output:", output);
        return true;
    } catch (error) {
        console.log("❌ Mirror Traffic update failed. Error:", errorOutput || error.message);
        return false;
    }
}

try {
    // const endpointName = core.getInput("endpoint_name");
    // const resourceGroup = core.getInput("resource_group");
    // const workspaceName = core.getInput("workspace_name");
    // const registryName = core.getInput("registry_name");
    // const registryResourceGroup = core.getInput("registry_resource_group");
    // const modelName = core.getInput("model_name");
    // const modelVersion = core.getInput("model_version");
    // const traffic = core.getInput("traffic");
    // const deploymentYamlFilePath = core.getInput("deployment_yaml_file_path");

    const endpointName = "test-endpoint-github-actions";
    const resourceGroup = "dev-ats-rg";
    const workspaceName = "dev-ats-llm-ws";
    const registryName = "";
    const registryResourceGroup = "";
    const modelName = "sklearn-model";
    const modelVersion = "1";
    const traffic = '{ "blue": 100 }';
    const deploymentYamlFilePath = "deployment.yaml";

    // Check if the required inputs are provided
    if (!endpointName || endpointName === "") {
        throw new Error("Endpoint name is required.");
    }

    if (!resourceGroup || resourceGroup === "") {
        throw new Error("Resource group is required");
    }

    if (!workspaceName || workspaceName === "") {
        throw new Error("Workspace name is required");
    }

    if (!modelName || modelName === "") {
        throw new Error("Model name is required");
    }

    if (!modelVersion || modelVersion === "") {
        throw new Error("Model version is required");
    }

    if (!traffic || traffic === "") {
        throw new Error("Traffic is required");
    }

    // Check if deployment YAML file exists
    if (!deploymentYamlFilePath || deploymentYamlFilePath === "") {
        throw new Error("Deployment YAML file path is required.");
    }

    // Check if the resource group exists
    console.log(`🔹 Checking if resource group '${resourceGroup}' exists...`)
    ;
    const resourceGroupExists = await checkIfResourceGroupExists(resourceGroup);

    if (!resourceGroupExists) {
        throw new Error(`Resource group '${resourceGroup}' does not exist.`);
    } else {
        console.log(`✅ Resource group '${resourceGroup}' exists.`);
    }

    // Check if the workspace exists
    console.log(`🔹 Checking if workspace '${workspaceName}' exists in resource group '${resourceGroup}'...`)
    ;
    const workspaceExists = await checkIfWorkspaceExists(workspaceName, resourceGroup);

    if (!workspaceExists) {
        throw new Error(`Workspace '${workspaceName}' does not exist in resource group '${resourceGroup}'.`);
    } else {
        console.log(`✅ Workspace '${workspaceName}' exists in resource group '${resourceGroup}'.`);
    }

    // Check if endpoint exists
    console.log(`🔹 Checking if endpoint '${endpointName}' exists...`);
    const endpointExits = await checkIfEndpointExists(
        endpointName, resourceGroup, workspaceName
    );

    if (!endpointExits) {
        throw new Error(`Endpoint '${endpointName}' does not exist in resource group '${resourceGroup}' and workspace '${workspaceName}'.`);
    } else {
        console.log(`✅ Endpoint '${endpointName}' exists in resource group '${resourceGroup}' and workspace '${workspaceName}''${resourceGroup}'.`);
    }

    // Parse the traffic input
    const trafficObj = JSON.parse(traffic);

    // Get values for "mirror"
    const trafficEntry = trafficObj["mirror"];

    // Check if "mirror" is present in the traffic object
    if (trafficEntry) {
        // Iterate through the keys of the "mirror" object
        for (const key in trafficEntry) {
            console.log(`🔹 Updating deployment '${key}' with mirror traffic '${trafficObj[key]}%'...`);

            // Update the mirror traffic
            let updateMirrorTraffic = await updateDeploymentMirrorTraffic(
                resourceGroup, workspaceName, endpointName, key, trafficEntry[key]
            );

            if (!updateMirrorTraffic) {
                console.log(`❌ Mirror traffic for '${key}' update failed.`);
            } else {
                console.log(`✅ Mirror traffic for '${key}' updated successfully.`);
            }
        }
    } else {
        console.log("🔹 No mirror traffic specified.");
    }

    // Get the keys of the traffic object except "mirror"
    const prodKeys = Object.keys(trafficObj).filter(key => key !== "mirror");

    // Iterate through the keys of the traffic object and update each deployment
    for (const key of prodKeys) {
        console.log(`🔹 Updating deployment '${key}' with traffic '${trafficObj[key]}%'...`);

        // Update the traffic for the deployment
        let updateTraffic = await updateDeploymentTraffic(
            resourceGroup, workspaceName, endpointName, key, trafficObj[key]
        );

        if (!updateTraffic) {
            console.log(`❌ Traffic for deployment '${key}' update failed.`);
        } else {
            console.log(
                `✅ Traffic for deployment '${key}' updated successfully.`
            );
        }
    }
    console.log("✅ Deployment traffic updated successfully.");
} catch (error) {
    console.log(error.message);
    core.setFailed(`❌ Action failed: ${error.message}`);
}
