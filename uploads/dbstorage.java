import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.*;
import com.google.gson.Gson; // Ensure you have the Gson library in your project

/**
 * DATA MODELS (Helper Classes)
 */
class LoginResponse {
    String accessToken;
    String refreshToken;
    String message;
}

class SignupRequest {
    String id, password;
    List<String> role;
    List<Map<String, String>> contact;

    SignupRequest(String id, String password, List<String> role, List<Map<String, String>> contact) {
        this.id = id; this.password = password; this.role = role; this.contact = contact;
    }
}

/**
 * MAIN STORAGE CLASS
 */
public class DBStorage {
    private final String baseURL = "http://localhost:10000";
    private String accessToken = null;
    private String refreshToken = null;
    private final HttpClient client = HttpClient.newHttpClient();
    private final Gson gson = new Gson();

    private void storeTokens(String access, String refresh) {
        this.accessToken = access;
        this.refreshToken = refresh;
    }

    public LoginResponse signin(String id, String password) throws Exception {
        Map<String, String> body = Map.of("id", id, "password", password);
        String jsonBody = gson.toJson(body);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseURL + "/auth/signin"))
                .header("Content-Type", "application/json")
                .POST(BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
        LoginResponse data = gson.fromJson(response.body(), LoginResponse.class);

        if (response.statusCode() == 200) {
            storeTokens(data.accessToken, data.refreshToken);
        } else {
            throw new RuntimeException(data.message != null ? data.message : "Login failed");
        }
        return data;
    }

    public String aiTXTGenerator(String msg, String context) throws Exception {
        Map<String, String> body = Map.of("msg", msg, "context", context);
        String jsonBody = gson.toJson(body);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseURL + "/process/generator/aiTXTGenerator"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + (accessToken != null ? accessToken : ""))
                .POST(BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
        return response.body();
    }

    /**
     * EXAMPLE USAGE (Main method inside the same file)
     */
    public static void main(String[] args) {
        DBStorage db = new DBStorage();
        try {
            System.out.println("Logging in...");
            db.signin("myUser", "myPass");
            
            System.out.println("Asking AI...");
            String aiResponse = db.aiTXTGenerator("Explain Java in one sentence", "Expert coder");
            System.out.println("AI Result: " + aiResponse);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}