package org.restlet.build.js;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.StringTokenizer;

public class ClassContextualizer {
	private File restletSrcPath;
	private boolean contextualize = true;
	private Map<String,String> classModuleNameMap = new HashMap<String, String>();
	private Map<String,List<String>> modules = new HashMap<String, List<String>>();

	public ClassContextualizer() {
		//load properties file
		Properties properties = new Properties();
		InputStream inputStream = null;
		try {
			inputStream = ClassContextualizer.class.getResourceAsStream("/org/restlet/build/js/modules.properties");
			properties.load(inputStream);
		} catch(Exception ex) {
			ex.printStackTrace();
		} finally {
			IOUtils.closeInputStream(inputStream);
		}
		
		for (String propertyName : properties.stringPropertyNames()) {
			String packageNamesAsString = properties.getProperty(propertyName);
			StringTokenizer st = new StringTokenizer(packageNamesAsString, ",");
			List<String> packageNames = new ArrayList<String>();
			modules.put(propertyName, packageNames);
			while (st.hasMoreTokens()) {
				String token = st.nextToken();
				packageNames.add(token);
			}
		}
	}
	
	public String handleFile(String fileToInclude, String contentToInclude) {
		StringBuilder newContent = new StringBuilder();
		int index = -1;
		while ((index=contentToInclude.indexOf("[class "))!=-1) {
			String beforeContent = contentToInclude.substring(0, index);
			newContent.append(beforeContent);
			String afterContent = contentToInclude.substring(index);
			if ((index=afterContent.indexOf("]"))!=-1) {
				String classHints = afterContent.substring(0, index+1);
				String className = ContextualizationUtils.extractClassNameFromTag(classHints);
				if (contextualize) {
					className = contextualizeClassName(className, fileToInclude);
				}
				newContent.append(className);
				contentToInclude = afterContent.substring(index+1);
			} else {
				System.err.println("Problem");
			}
		}
		
		if (contentToInclude.length()>0) {
			newContent.append(contentToInclude);
		}
		
		return newContent.toString();
	}

	private String getModuleForPackage(String classPackage) {
		for (String moduleName : modules.keySet()) {
			List<String> packageNames = modules.get(moduleName);
			for (String packageName : packageNames) {
				if (packageName.equals(classPackage)) {
					return moduleName;
				}
			}
		}
		return null;
	}
	
	private String contextualizeClassName(String className, String fileToInclude) {
		String classNameWithPackage = ContextualizationUtils.getClassWithPackage(restletSrcPath, className);
		String classPackage = ContextualizationUtils.getPackage(classNameWithPackage);
		String currentPackage = ContextualizationUtils.getPackage(fileToInclude);
		if (classPackage.equals(currentPackage)) {
			return className;
		} else {
			String moduleName = classModuleNameMap.get(className);
			if (moduleName==null) {
				moduleName = getModuleForPackage(classPackage);
			}
			
			if (moduleName!=null && !moduleName.trim().equals("")) {
				return moduleName+"."+className;
			} else {
				return className;
			}
		}
	}

	public File getRestletSrcPath() {
		return restletSrcPath;
	}

	public void setRestletSrcPath(File restletSrcPath) {
		this.restletSrcPath = restletSrcPath;

		if (restletSrcPath==null || !restletSrcPath.exists()) {
			throw new IllegalArgumentException(
					"Restlet JS source folder isn't specified or doesn't exist");
		}
	}

	public boolean isContextualize() {
		return contextualize;
	}

	public void setContextualize(boolean contextualize) {
		this.contextualize = contextualize;
	}

}
