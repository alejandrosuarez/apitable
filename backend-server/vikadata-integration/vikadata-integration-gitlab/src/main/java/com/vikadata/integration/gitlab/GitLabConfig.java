package com.vikadata.integration.gitlab;

import org.gitlab4j.api.GitLabApi.ApiVersion;

/**
 * GitLab config
 *
 */
public class GitLabConfig {

    private ApiVersion apiVersion = ApiVersion.V4;

    private String url;

    private String personalAccessToken;

    public ApiVersion getApiVersion() {
        return apiVersion;
    }

    public void setApiVersion(ApiVersion apiVersion) {
        this.apiVersion = apiVersion;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPersonalAccessToken() {
        return personalAccessToken;
    }

    public void setPersonalAccessToken(String personalAccessToken) {
        this.personalAccessToken = personalAccessToken;
    }
}
