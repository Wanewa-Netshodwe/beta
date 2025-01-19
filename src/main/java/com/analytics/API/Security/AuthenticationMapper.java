package com.analytics.API.Security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class AuthenticationMapper  extends AbstractAuthenticationToken {
    private String api_key ="";
    public AuthenticationMapper(String api_key, Collection<? extends GrantedAuthority> authorities){
        super(authorities);
        this.api_key = api_key;
        setAuthenticated(true);


    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }
}
