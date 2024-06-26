const query_string = require("querystring");
const axios = require("axios");
const google_auth_token_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const google_access_token_endpoint = 'https://oauth2.googleapis.com/token';

const query_params = {
	client_id: process.env.CLIENT_APP_ID,
	redirect_uri: `http://localhost:8080${process.env.REDIRECT_URI}`,
};

const auth_token_params = {
	...query_params,
	response_type: "code",
};

const scopes = ["profile", "email", "openid"];
const request_get_auth_code_url = `${google_auth_token_endpoint}?${query_string.stringify (auth_token_params)}&scope=${scopes.join (' ')}`;

const get_access_token = async auth_code => {
	const access_token_params = {
		...query_params,
		client_secret: process.env.CLIENT_APP_SECRET,
		code: auth_code,
		grant_type: "authorization_code",
	};
	return await axios ({
		method: "post",
		url: `${google_access_token_endpoint}?${query_string.stringify (access_token_params)}`,
	});
};

const get_profile_data = async access_token => {
	return await axios ({
		method: "post",
		url: `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`,
	});
}


module.exports = {request_get_auth_code_url, get_access_token, get_profile_data};
