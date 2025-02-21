"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core = require("@actions/core");
var release_notes_generator_1 = require("@semantic-release/release-notes-generator");
var github_1 = require("@actions/github");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var version, repository, owner, repo, fromRef, toRef, githubToken, octokit, commits, releaseNotes, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    version = core.getInput('title');
                    repository = core.getInput('repository');
                    owner = core.getInput('owner');
                    repo = core.getInput('repo');
                    fromRef = core.getInput('from_ref_exclusive');
                    toRef = core.getInput('to_ref_inclusive');
                    githubToken = core.getInput('github_token');
                    if (repository)
                        _a = repository.split('/'), owner = _a[0], repo = _a[1];
                    else if (owner && repo)
                        repository = owner + '/' + repo;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    octokit = github_1.getOctokit(githubToken);
                    return [4 /*yield*/, octokit.repos.compareCommits({
                            owner: owner,
                            repo: repo,
                            base: fromRef,
                            head: toRef
                        })];
                case 2:
                    commits = (_b.sent()).data.commits
                        .filter(function (commit) { return !!commit.commit.message; })
                        .map(function (commit) { return ({
                        message: commit.commit.message,
                        hash: commit.sha
                    }); });
                    return [4 /*yield*/, release_notes_generator_1.generateNotes({}, {
                            commits: commits,
                            logger: { log: core.info },
                            options: {
                                repositoryUrl: repository
                                    ? "https://github.com/" + repository
                                    : "https://github.com/" + process.env.GITHUB_REPOSITORY
                            },
                            lastRelease: { gitTag: fromRef },
                            nextRelease: { gitTag: toRef, version: version }
                        })];
                case 3:
                    releaseNotes = _b.sent();
                    core.info("Release notes: " + releaseNotes);
                    core.setOutput('release_notes', releaseNotes);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    core.setFailed("Action failed with error " + error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
run();
