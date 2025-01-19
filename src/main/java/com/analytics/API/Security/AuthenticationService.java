package com.analytics.API.Security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;

public class AuthenticationService {
    final private static String  HEADER_TOKEN_NAME = "AHH-API-KEY";
    final private static String  AUTH_TOKEN = "yEeT_Th1s_4PI-k3y_S3cUrE_xD_707";
    public static Authentication getAuthentication(HttpServletRequest request){
        String api_key  = request.getHeader(HEADER_TOKEN_NAME);
        if(api_key == null || !api_key.equals((AUTH_TOKEN))){
            throw  new BadCredentialsException("invalid API Key");
        }
        return new AuthenticationMapper(api_key, AuthorityUtils.NO_AUTHORITIES);

    }

}
