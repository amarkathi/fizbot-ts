package com.example.myproject;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.ibm.watson.developer_cloud.assistant.v1.Assistant;
import com.ibm.watson.developer_cloud.assistant.v1.model.CreateExampleOptions;
import com.ibm.watson.developer_cloud.assistant.v1.model.DeleteExampleOptions;
import com.ibm.watson.developer_cloud.assistant.v1.model.Example;
import com.ibm.watson.developer_cloud.assistant.v1.model.ExampleCollection;
import com.ibm.watson.developer_cloud.assistant.v1.model.GetExampleOptions;
import com.ibm.watson.developer_cloud.assistant.v1.model.InputData;
import com.ibm.watson.developer_cloud.assistant.v1.model.ListExamplesOptions;
import com.ibm.watson.developer_cloud.assistant.v1.model.MessageOptions;
import com.ibm.watson.developer_cloud.assistant.v1.model.MessageResponse;
import com.ibm.watson.developer_cloud.assistant.v1.model.UpdateExampleOptions;
import com.ibm.watson.developer_cloud.service.security.IamOptions;

public class WatsonTesting {

	private static final String VERSION_ID = "2018-09-20";
	private static final String WORKSPACE_ID = "09fe48e3-298b-43ad-a164-075bee29e1dc";
	private static final String API_KEY = "-Ns2PQU2iTV1bLShjfB4aROANSQWfsoXHXpKllNHtqCr";
	private static final String FILE_NAME = "";
	
	public static void main(String[] args) {

        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Datatypes in Java");
        Object[][] datatypes = {
                {"Datatype", "Type", "Size(in bytes)"},
                {"int", "Primitive", 2},
                {"float", "Primitive", 4},
                {"double", "Primitive", 8},
                {"char", "Primitive", 1},
                {"String", "Non-Primitive", "No fixed size"}
        };

        int rowNum = 0;
        System.out.println("Creating excel");

        for (Object[] datatype : datatypes) {
            Row row = sheet.createRow(rowNum++);
            int colNum = 0;
            for (Object field : datatype) {
                Cell cell = row.createCell(colNum++);
                if (field instanceof String) {
                    cell.setCellValue((String) field);
                } else if (field instanceof Integer) {
                    cell.setCellValue((Integer) field);
                }
            }
        }

        try {
            FileOutputStream outputStream = new FileOutputStream(FILE_NAME);
            workbook.write(outputStream);
            workbook.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("Done");
        
        /**  ******************************************************************************************
	    	
	    	1) Get the list of intents in the excel
	    	2) Policy is always 
	 			a) intents are always be removed and added if there is any change
	 			b) dialog nodes only the responses will be updated if the responses are to be updated
	 			c) entities are always be removed and updated
	 		3) Apply the changes in Development and run the tests
	 		4) Promote it to production
    
         *****************************************************************************************  **/
    
	}

	public static void listIntent() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		
		String intent = "Cal-eProcure_approve_CSCR_event";
		ListExamplesOptions options = new ListExamplesOptions.Builder(WORKSPACE_ID, intent).build();

		ExampleCollection response = service.listExamples(options).execute();
		System.out.println(response);
	}

	
	public static void createIntent() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Howdy!";

		CreateExampleOptions options = new CreateExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		Example response = service.createExample(options).execute();

		System.out.println(response);
	}
	
	public static void getIntent() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Good afternoon";

		GetExampleOptions options = new GetExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		Example response = service.getExample(options).execute();

		System.out.println(response);
	}
	
	public static void updateIntent() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Hi there";
		String newText = "Hello there!";

		UpdateExampleOptions options = new UpdateExampleOptions.Builder(WORKSPACE_ID, intent, example)
		  .newText(newText)
		  .build();

		Example response = service.updateExample(options).execute();

		System.out.println(response);
	}
	public static void deleteIntrent() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Good afternoon";

		DeleteExampleOptions options = new DeleteExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		service.deleteExample(options).execute();
	}
	
	public static void listUserExamples() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		
		String intent = "Cal-eProcure_approve_CSCR_event";
		ListExamplesOptions options = new ListExamplesOptions.Builder(WORKSPACE_ID, intent).build();

		ExampleCollection response = service.listExamples(options).execute();
		System.out.println(response);
	}

	
	public static void createUserExamples() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Howdy!";

		CreateExampleOptions options = new CreateExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		Example response = service.createExample(options).execute();

		System.out.println(response);
	}
	
	public static void getUserInputExamples() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Good afternoon";

		GetExampleOptions options = new GetExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		Example response = service.getExample(options).execute();

		System.out.println(response);
	}
	
	public static void updateInputExamples() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Hi there";
		String newText = "Hello there!";

		UpdateExampleOptions options = new UpdateExampleOptions.Builder(WORKSPACE_ID, intent, example)
		  .newText(newText)
		  .build();

		Example response = service.updateExample(options).execute();

		System.out.println(response);
	}
	public static void deleteInputExamples() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Good afternoon";

		DeleteExampleOptions options = new DeleteExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		service.deleteExample(options).execute();
	}

	// Dialog nodes
	public static void listDialogNodes() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		
		String intent = "Cal-eProcure_approve_CSCR_event";
		ListExamplesOptions options = new ListExamplesOptions.Builder(WORKSPACE_ID, intent).build();

		ExampleCollection response = service.listExamples(options).execute();
		System.out.println(response);
	}

	
	public static void createDialogNode() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Howdy!";

		CreateExampleOptions options = new CreateExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		Example response = service.createExample(options).execute();

		System.out.println(response);
	}
	
	public static void getDialogNode() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Good afternoon";

		GetExampleOptions options = new GetExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		Example response = service.getExample(options).execute();

		System.out.println(response);
	}
	
	public static void updateDialogNode() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Hi there";
		String newText = "Hello there!";

		UpdateExampleOptions options = new UpdateExampleOptions.Builder(WORKSPACE_ID, intent, example)
		  .newText(newText)
		  .build();

		Example response = service.updateExample(options).execute();

		System.out.println(response);
	}
	public static void deleteDialogNode() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		String example = "Good afternoon";

		DeleteExampleOptions options = new DeleteExampleOptions.Builder(WORKSPACE_ID, intent, example).build();

		service.deleteExample(options).execute();
	}
	
	public static void getMessage() {
		
		IamOptions iamOptions = new IamOptions.Builder().apiKey(API_KEY).build();
		Assistant service = new Assistant(VERSION_ID, iamOptions);

		String intent = "Cal-eProcure_approve_CSCR_event";

		InputData input = new InputData.Builder("Cal-eProcure_approve_CSCR_event").build();

		MessageOptions options = new MessageOptions.Builder(WORKSPACE_ID)
		  .input(input)
		  .build();

		MessageResponse response = service.message(options).execute();

		System.out.println(response);
	}

}