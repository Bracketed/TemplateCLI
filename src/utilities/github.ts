import axios from 'axios';

class github {
	static async check(repoOwner: string, repoName: string, auth?: string | undefined | null) {
		if (!repoOwner) return false;
		if (!repoName) return false;

		if (auth) {
			const request = await axios
				.get(`https://api.github.com/repos/${repoOwner.toLowerCase()}/${repoName.toLowerCase()}`, {
					headers: { Authorization: `Bearer ${auth}` },
				})
				.then((d) => d.status)
				.catch((e) => e.response.status);

			return request;
		} else {
			const request = await axios
				.get(`https://api.github.com/repos/${repoOwner.toLowerCase()}/${repoName.toLowerCase()}`)
				.then((d) => d.status)
				.catch((e) => e.response.status);

			return request;
		}
	}
}

export { github };
