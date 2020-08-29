import core from '@actions/core';
import github from '@actions/github';

const token = core.getInput('github_token') || process.env.GITHUB_TOKEN;

const octokit = github.getOctokit(token);

const pull_number = parseInt(core.getInput('pull_number'), 10);

try {
	const { data } = await octokit.pulls.get({
		...github.context.repo,
		pull_number,
	});

	core.setOutput('maintainer_can_modify', data.maintainer_can_modify);

	if (!data.maintainer_can_modify) {
		core.setFailed('This pull request must have the “allow edits” checkbox checked.');
	}
} catch (error) {
	core.setFailed(error ?? 'Unknown error');
}
