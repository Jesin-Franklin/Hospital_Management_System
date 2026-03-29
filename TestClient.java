import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class TestClient {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        System.out.println("--- TESTING REGISTER PATIENT ---");
        HttpRequest regReq = HttpRequest.newBuilder()
            .uri(new URI("http://localhost:8080/api/auth/register"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{\"username\":\"patientagent\",\"password\":\"patientage\",\"role\":\"PATIENT\",\"name\":\"Agent Name\",\"gender\":\"Male\"}"))
            .build();
            
        HttpResponse<String> regRes = client.send(regReq, HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + regRes.statusCode());
        System.out.println("Body: " + regRes.body());

        System.out.println("\n--- TESTING LOGIN ---");
        HttpRequest loginReq = HttpRequest.newBuilder()
            .uri(new URI("http://localhost:8080/api/auth/login"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{\"username\":\"patientagent\",\"password\":\"patientage\"}"))
            .build();
            
        HttpResponse<String> loginRes = client.send(loginReq, HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + loginRes.statusCode());
        System.out.println("Body: " + loginRes.body());
    }
}
