package com.analytics.API.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpRequest;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.http.HttpResponse;

public class AuthenticationFilter  extends GenericFilterBean {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        try{
            Authentication authentication = AuthenticationService.getAuthentication((HttpServletRequest) servletRequest );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        catch (Exception err){
            HttpServletResponse response = (HttpServletResponse) servletResponse;
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            PrintWriter writer = servletResponse.getWriter();
            writer.print(err.getMessage());
            writer.flush();
            writer.close();
        }
        filterChain.doFilter(servletRequest,servletResponse);
    }
}
