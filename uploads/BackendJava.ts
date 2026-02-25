package com.example.codea;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class Backend {

    private static final String BASE_URL = "https://dbstorage.onrender.com";
    private static final String PREF_NAME = "app";
    private static final String TOKEN_KEY = "token";

    private static OkHttpClient client;

    // Initialize once (call in MainActivity onCreate)
    public static void init(Context context) {

        client = new OkHttpClient.Builder()
                .addInterceptor(chain -> {
                    // JWT header
                    SharedPreferences prefs = context.getSharedPreferences("app", Context.MODE_PRIVATE);
                    String token = prefs.getString("token", null);

                    Request original = chain.request();
                    Request.Builder builder = original.newBuilder()
                            .addHeader("Accept", "application/json");

                    if (token != null) {
                        builder.addHeader("Authorization", "Bearer " + token);
                    }

                    return chain.proceed(builder.build());
                })
                .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)   // connection timeout
                .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)      // read timeout
                .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)     // write timeout
                .build();
    }

    // SAVE TOKEN
    public static void saveToken(Context context, String token) {
        SharedPreferences prefs =
                context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(TOKEN_KEY, token).apply();
    }

    // MAIN REQUEST FUNCTION
    public static void request(
            String endpoint,
            String method,
            JSONObject body,
            ApiCallback callback
    ) {

        if (client == null) {
            callback.onError("BackendService not initialized");
            return;
        }

        MediaType JSON = MediaType.get("application/json; charset=utf-8");
        RequestBody requestBody = null;

        if (body != null) {
            requestBody = RequestBody.create(body.toString(), JSON);
        }

        Request.Builder builder = new Request.Builder()
                .url(BASE_URL + endpoint);

        switch (method.toUpperCase()) {

            case "POST":
                builder.post(requestBody);
                break;

            case "PUT":
                builder.put(requestBody);
                break;

            case "DELETE":
                if (requestBody != null)
                    builder.delete(requestBody);
                else
                    builder.delete();
                break;

            default:
                builder.get();
                break;
        }

        client.newCall(builder.build()).enqueue(new Callback() {

            @Override
            public void onFailure(Call call, IOException e) {
                callback.onError(e.getMessage());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String responseString = response.body() != null ? response.body().string() : "";

                if (response.isSuccessful()) {
                    try {
                        JSONObject obj = new JSONObject(responseString);
                        // do something with obj
                    } catch (JSONException e) {
                        e.printStackTrace();
                        callback.onError("JSON parse error: " + e.getMessage());
                        return;
                    }

                    try {
                        callback.onSuccess(responseString);
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    callback.onError("Code: " + response.code() + " | " + responseString);
                }
            }
        });
    }

    // CALLBACK INTERFACE
    public interface ApiCallback {
        void onSuccess(String response) throws JSONException;
        void onError(String error);
    }
}

//implementation("com.squareup.okhttp3:okhttp:4.12.0")
//implementation("com.google.code.gson:gson:2.10.1")  
//<uses-permission android:name="android.permission.INTERNET"/>
//
//Example Usage:
//try {
//Backend.init(this);
//   JSONObject json = new JSONObject();
//                    json.put("id", myEditText.getText().toString());
//                    json.put("password", myEditTextPassword.getText().toString());
//                    Backend.request("/auth/signin", "POST", json,
//                            new Backend.ApiCallback() {
//                                @Override
//                                public void onSuccess(String response) throws JSONException {
//                                    Log.d("mainact", "success"+response);
//                                    JSONObject obj = new JSONObject(response);
//                                    String token = obj.getString("accessToken");
//                                }
//                                @Override
//                                public void onError(String error) {
//                                    Log.d("mainact", "error"+error);
//                                }
//                            });
//} catch (Exception e) {log.d("tag", e.toString()) }
//
