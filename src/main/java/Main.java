import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class Main {

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.print("Введите ИНН: ");
        String inn = br.readLine();
        System.out.print("Введите КПП: ");
        String kpp = br.readLine();
        System.out.print("Введите дату: ");
        String date = br.readLine();
        WebDriver driver = new ChromeDriver();
        driver.get("http://npchk.nalog.ru/");
        driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
        WebElement innField = driver.findElement(By.cssSelector("#inn"));
        WebElement kppField = driver.findElement(By.cssSelector("#kpp"));
        WebElement dateField = driver.findElement(By.cssSelector("#dt"));
        dateField.clear();
        innField.clear();
        for (int i = 0; i < inn.length(); i++) {
            innField.sendKeys(String.valueOf(inn.charAt(i)));
        }
        for (int i = 0; i < kpp.length(); i++) {
            kppField.sendKeys(String.valueOf(kpp.charAt(i)));
        }
        dateField.sendKeys(date);
        innField.submit();
        List<WebElement> linkList = driver.findElements(By.cssSelector(".hide.information.warning"));
        List<WebElement> linkList2 = driver.findElements(By.cssSelector(".hide.information.pnl-info"));
        List<WebElement> linkList3 = driver.findElements(By.cssSelector(".field-errors"));
        for (WebElement w : linkList) {
            System.out.println(w.getText());
        }
        for (WebElement w : linkList2) {
            System.out.println(w.getText());
        }
        for (WebElement w : linkList3) {
            System.out.println(w.getText());
        }
        if (!isDigit(inn)) System.out.println("Недопустимые символы в ИНН");
        if (!isDigit(kpp)) System.out.println("Недопустимые символы в КПП");
        driver.close();
    }

    private static boolean isDigit(String s) throws NumberFormatException {
        if (!s.equals("")) {
            try {
                Integer.parseInt(s);
                return true;
            } catch (NumberFormatException e) {
                return false;
            }
        } else
            return true;
    }


}
