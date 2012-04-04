package org.restlet.build.js;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.Reader;
import java.io.Writer;

public abstract class IOUtils {

	public static void closeReader(Reader reader) {
		try {
			if (reader!=null) {
				reader.close();
			}
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}

	public static void closeWriter(Writer writer) {
		try {
			if (writer!=null) {
				writer.close();
			}
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	public static void closeInputStream(InputStream inputStream) {
		try {
			if (inputStream!=null) {
				inputStream.close();
			}
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}

	public static void closeOutputStream(InputStream outputStream) {
		try {
			if (outputStream!=null) {
				outputStream.close();
			}
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}

	public static String getFileContent(String fileName) {
		return getFileContent(new File(fileName));
	}

	public static String getFileContent(File file) {
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new FileReader(file));
			StringBuilder content = new StringBuilder();
			String line = null;
			boolean firstLine = true;
			while ((line=reader.readLine())!=null) {
				if (!firstLine) {
					content.append("\n");
				}
				
				content.append(line);
				
				if (firstLine) {
					firstLine = false;
				}
			}
			return content.toString();
		} catch(Exception ex) {
			ex.printStackTrace();
		} finally {
			closeReader(reader);
		}
		return null;
	}
	
	public static void setFileContent(String fileName, String content) {
		setFileContent(new File(fileName), content);
	}

	public static void setFileContent(File file, String content) {
		FileWriter writer = null;
		try {
			writer = new FileWriter(file);
			writer.write(content);
		} catch(Exception ex) {
			ex.printStackTrace();
		} finally {
			IOUtils.closeWriter(writer);
		}
	}

}
