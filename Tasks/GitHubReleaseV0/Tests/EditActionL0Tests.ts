import tmrm = require('vsts-task-lib/mock-run');
import * as path from 'path';
import { Inputs } from '../operations/Constants';
import * as sinon from 'sinon';

export class EditActionL0Tests {
    
    public static startTest() {
        let tp = path.join(__dirname, '..', 'main.js');
        let tr : tmrm.TaskMockRunner = new tmrm.TaskMockRunner(tp);
        
        tr.setInput(Inputs.gitHubConnection, "connection");
        tr.setInput(Inputs.repositoryName, "repo");
        tr.setInput(Inputs.action, "edit");
        tr.setInput(Inputs.target, "master");
        tr.setInput(Inputs.tagSource, "manual");
        tr.setInput(Inputs.tag, "v1.0.0");
        
        this.stub(tr);
        tr.run();

        this.sandbox.restore();
    }
    
    public static stub(tr) {
        this.sandbox = sinon.sandbox.create();
        
        var Utility = require('../operations/Utility');
        this.sandbox.stub(Utility.Utility, "getGithubEndPointToken").callsFake(function() { return { scheme: 'OAuth', parameters: { AccessToken: "**someToken**"}} });

        tr.registerMock("./operations/Helper", {
            Helper: function () {
                return {
                    getReleaseIdForTag: () => {
                        return null;
                    },
                    publishTelemetry: () => {

                    }
                }
            }
        });

        tr.registerMock("./operations/Action", {
            Action: function () {
                return {
                    createReleaseAction: () => {
                        console.log("L0Test: create release action method should be called when no release is present for given tag"); // = this.createActionKeyWord
                    }
                }
            }
        });
        
    }
    
    public static sandbox;
    public static readonly createActionKeyWord: string = "L0Test: create release action method should be called when no release is present for given tag";
}

EditActionL0Tests.startTest();