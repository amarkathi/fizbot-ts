package com.example.myproject;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ibm.watson.developer_cloud.assistant.v1.Assistant;
import com.ibm.watson.developer_cloud.assistant.v1.model.InputData;
import com.ibm.watson.developer_cloud.assistant.v1.model.MessageOptions;
import com.ibm.watson.developer_cloud.assistant.v1.model.MessageResponse;
import com.ibm.watson.developer_cloud.service.security.IamOptions;

@RestController
@EnableAutoConfiguration
public class Example1 {

	final static Logger logger = Logger.getLogger(Example1.class);
	
	@CrossOrigin 
	@RequestMapping(value = "/hello", headers = "Accept=application/json", method = RequestMethod.POST)
	private String getResponse(@RequestBody Map<String, Map<String, Object>> payload) {
		logger.info(payload.toString());
		logger.info(payload.get("input").get("text"));
		return getMessage((String)payload.get("input").get("text"));
	}

	public static void main(String[] args) throws Exception {
		SpringApplication.run(Example1.class, args);
	}

	private static final String VERSION_ID = "2018-09-20";
	private static final String WORKSPACE_ID = "09fe48e3-298b-43ad-a164-075bee29e1dc";
	private static final String API_KEY = "-Ns2PQU2iTV1bLShjfB4aROANSQWfsoXHXpKllNHtqCr";
	
	public static String getMessage(String userInput) {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		InputData input = new InputData.Builder(userInput).build();

		MessageOptions options = new MessageOptions.Builder(WORKSPACE_ID).input(input).build();

		MessageResponse response = service.message(options).execute();

		return response.toString();
	}
}