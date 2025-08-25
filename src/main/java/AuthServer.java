import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AuthServer {

    private static final String USERNAME = "admin";
    private static final String PASSWORD = "admin";
    private static final String SESSION_COOKIE_NAME = "SESSION";

    public static void main(String[] args) throws IOException {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/", new RootHandler());
        server.createContext("/login", new LoginHandler());
        server.createContext("/logout", new LogoutHandler());

        server.setExecutor(null);
        System.out.println("Auth server started on http://localhost:" + port);
        server.start();
    }

    static class RootHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!isAuthenticated(exchange)) {
                redirect(exchange, "/login");
                return;
            }
            String body = "" +
                    "<html><head><meta charset=\"UTF-8\"><title>Home</title></head><body>" +
                    "<h2>Вы авторизованы</h2>" +
                    "<p>Это защищенная страница проекта.</p>" +
                    "<p><a href=\"/logout\">Выйти</a></p>" +
                    "</body></html>";
            sendHtml(exchange, 200, body);
        }
    }

    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            if ("GET".equalsIgnoreCase(method)) {
                showForm(exchange, null);
                return;
            }
            if ("POST".equalsIgnoreCase(method)) {
                Map<String, String> form = parseForm(exchange.getRequestBody());
                String username = form.getOrDefault("username", "");
                String password = form.getOrDefault("password", "");
                if (USERNAME.equals(username) && PASSWORD.equals(password)) {
                    Headers headers = exchange.getResponseHeaders();
                    headers.add("Set-Cookie", SESSION_COOKIE_NAME + "=ok; HttpOnly; Path=/; Max-Age=3600");
                    redirect(exchange, "/");
                } else {
                    showForm(exchange, "Неверный логин или пароль");
                }
                return;
            }
            sendText(exchange, 405, "Method Not Allowed");
        }

        private void showForm(HttpExchange exchange, String error) throws IOException {
            String err = (error == null) ? "" : "<p style=\"color:red\">" + escapeHtml(error) + "</p>";
            String body = "" +
                    "<html><head><meta charset=\"UTF-8\"><title>Вход</title>" +
                    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
                    "<style>body{font-family:sans-serif;margin:40px}form{max-width:320px}input{width:100%;padding:10px;margin:6px 0;border:1px solid #ccc;border-radius:6px}button{padding:10px 14px;border:0;border-radius:6px;background:#1f6feb;color:#fff;cursor:pointer;width:100%}button:hover{background:#1158c7}.card{padding:20px;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.06)}</style>" +
                    "</head><body>" +
                    "<div class=\"card\">" +
                    "<h2>Авторизация</h2>" + err +
                    "<form method=\"post\" action=\"/login\">" +
                    "<label>Логин</label><input type=\"text\" name=\"username\" placeholder=\"Логин\" required autofocus>" +
                    "<label>Пароль</label><input type=\"password\" name=\"password\" placeholder=\"Пароль\" required>" +
                    "<button type=\"submit\">Войти</button>" +
                    "</form>" +
                    "</div>" +
                    "</body></html>";
            sendHtml(exchange, 200, body);
        }
    }

    static class LogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
            headers.add("Set-Cookie", SESSION_COOKIE_NAME + "=deleted; Path=/; Max-Age=0");
            redirect(exchange, "/login");
        }
    }

    private static boolean isAuthenticated(HttpExchange exchange) {
        List<String> cookies = exchange.getRequestHeaders().get("Cookie");
        if (cookies == null) return false;
        for (String header : cookies) {
            String[] parts = header.split(";");
            for (String p : parts) {
                String kv = p.trim();
                int idx = kv.indexOf('=');
                if (idx > 0) {
                    String name = kv.substring(0, idx).trim();
                    String value = kv.substring(idx + 1).trim();
                    if (SESSION_COOKIE_NAME.equals(name) && "ok".equals(value)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private static Map<String, String> parseForm(InputStream is) throws IOException {
        byte[] bytes = is.readAllBytes();
        String raw = new String(bytes, StandardCharsets.UTF_8);
        Map<String, String> map = new HashMap<>();
        if (raw.isEmpty()) return map;
        String[] pairs = raw.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf('=');
            if (idx >= 0) {
                String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                String val = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
                map.put(key, val);
            }
        }
        return map;
    }

    private static void redirect(HttpExchange exchange, String location) throws IOException {
        Headers headers = exchange.getResponseHeaders();
        headers.add("Location", location);
        exchange.sendResponseHeaders(302, -1);
        exchange.close();
    }

    private static void sendHtml(HttpExchange exchange, int status, String html) throws IOException {
        byte[] bytes = html.getBytes(StandardCharsets.UTF_8);
        Headers headers = exchange.getResponseHeaders();
        headers.add("Content-Type", "text/html; charset=UTF-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void sendText(HttpExchange exchange, int status, String text) throws IOException {
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        Headers headers = exchange.getResponseHeaders();
        headers.add("Content-Type", "text/plain; charset=UTF-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String escapeHtml(String s) {
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}

