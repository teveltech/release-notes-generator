import * as core from '@actions/core';
import { generateNotes } from '@semantic-release/release-notes-generator';
import { context, getOctokit } from '@actions/github';

async function run(): Promise<void> {
  try {
    const version = core.getInput('version');
    let repository = core.getInput('repository');
    let owner = core.getInput('owner');
    let repo = core.getInput('repo');
    const fromRef = core.getInput('from_ref_exclusive');
    const toRef = core.getInput('to_ref_inclusive');
    const githubToken = core.getInput('github_token');
    if (repository)
      [owner, repo] = repository.split("/");
    if (owner && repo)
      repository = owner + '/' + repo
    
    const octokit = getOctokit(githubToken);

    const commits = (
      await octokit.repos.compareCommits({
        owner: owner,
        repo: repo,
        base: fromRef,
        head: toRef
      })
    ).data.commits
      .filter((commit) => !!commit.commit.message)
      .map((commit) => ({
        message: commit.commit.message,
        hash: commit.sha
      }));

      const releaseNotes = await generateNotes(
      {},
      {
        commits,
        logger: { log: core.info },
        options: {
          repositoryUrl: repository
            ? `https://github.com/${repository}`
            : `https://github.com/${process.env.GITHUB_REPOSITORY}`,
        },
        lastRelease: { gitTag: fromRef },
        nextRelease: { gitTag: toRef, version: version }
      }
      );

    core.info(`Release notes: ${releaseNotes}`);
    core.setOutput('release_notes', releaseNotes);
  } catch (error) {
    core.setFailed(`Action failed with error ${error.stack} ${repository}`);
  }
}

run();
