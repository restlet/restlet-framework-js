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
	private Map<String ,Module> modules = new HashMap<String, Module>();

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
			if (propertyName.endsWith(".excludes")) {
				//module exclude classes
				String excludeNamesAsString = properties.getProperty(propertyName);
				String moduleName = propertyName.replace(".excludes", "");
				StringTokenizer st = new StringTokenizer(excludeNamesAsString, ",");
				List<String> excludeNames = new ArrayList<String>();
				Module module = getModule(moduleName);
				module.setExcludeClasses(excludeNames);
				while (st.hasMoreTokens()) {
					String token = st.nextToken();
					excludeNames.add(token);
				}
			} else if (propertyName.endsWith(".includes")) {
				//module include classes
				String includeNamesAsString = properties.getProperty(propertyName);
				String moduleName = propertyName.replace(".includes", "");
				StringTokenizer st = new StringTokenizer(includeNamesAsString, ",");
				List<String> includeNames = new ArrayList<String>();
				Module module = getModule(moduleName);
				module.setIncludeClasses(includeNames);
				while (st.hasMoreTokens()) {
					String token = st.nextToken();
					includeNames.add(token);
				}
			} else {
				//module packages
				String packageNamesAsString = properties.getProperty(propertyName);
				StringTokenizer st = new StringTokenizer(packageNamesAsString, ",");
				List<String> packageNames = new ArrayList<String>();
				Module module = getModule(propertyName);
				module.setPackages(packageNames);
				while (st.hasMoreTokens()) {
					String token = st.nextToken();
					packageNames.add(token);
				}
			}
		}
	}
	
	private Module getModule(String moduleName) {
		Module module = (Module) modules.get(moduleName);
		if (module==null) {
			module = new Module(moduleName);
			modules.put(moduleName, module);
		}
		return module;
	}
	
	public ContextualizedContent handleFile(String fileToInclude, String contentToInclude) {
		//contentToInclude = doHandleEdition(fileToInclude, contentToInclude);
		return doHandleClassContextualization(fileToInclude, contentToInclude);
	}
	
	private String doHandleEdition(String fileToInclude, String contentToInclude) {
		StringBuilder newContent = new StringBuilder();
		StringTokenizer st = new StringTokenizer(contentToInclude, "\n");
		boolean begin = true;
		//boolean 
		while (st.hasMoreTokens()) {
			String token = st.nextToken();
			if (token.trim().startsWith("// [ifndef")) {
				
			} else if (token.trim().startsWith("// [ifdef")) {
				
			} else {
				if (!begin) {
					newContent.append("\n");
					newContent.append(token);
				}
			}
			
			if (begin) {
				begin = false;
			}
		}
		return newContent.toString();
	}

	private ContextualizedContent doHandleClassContextualization(String fileToInclude, String contentToInclude) {
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
		
		return new ContextualizedContent(newContent.toString(), getUsedModuleNames());
	}

	private boolean isSameModule(String className, String classPackage, String currentClassName, String currentPackage) {
		String moduleName = getModuleNameForClass(className);
		if (moduleName==null) {
			moduleName = lookupModuleForClass(className, classPackage);
			classModuleNameMap.put(className, moduleName);
		}

		String currentModuleName = getModuleNameForClass(currentClassName);
		if (currentModuleName==null) {
			currentModuleName = lookupModuleForClass(currentClassName, currentPackage);
			classModuleNameMap.put(currentClassName, currentModuleName);
		}
		
		System.out.println("Ref : "+className+" - "+classPackage+" : "+moduleName);
		System.out.println("Current : "+currentClassName+" - "+currentPackage+" : "+currentModuleName);
		return moduleName.equals(currentModuleName);
	}
	
	private String contextualizeClassName(String className, String fileToInclude) {
		if (isCommonsClass(className)) {
			if (classModuleNameMap.get("commons")!=null) {
				classModuleNameMap.put(className, "commons");
			}
			return "commons."+className;
		} else {
			String classNameWithPackage = ContextualizationUtils.getClassWithPackage(restletSrcPath, className);
			String classPackage = ContextualizationUtils.getPackage(classNameWithPackage);
			String currentClassNameWithPackage = ContextualizationUtils.getClassNameWithPackageFromFileName(fileToInclude);
			String currentClassName = ContextualizationUtils.getClassName(currentClassNameWithPackage);
			String currentPackage = ContextualizationUtils.getPackage(currentClassNameWithPackage);
			if (classPackage.equals(currentPackage) || isSameModule(className, classPackage, currentClassName, currentPackage)) {
				return className;
			} else {
				String moduleName = getModuleNameForClass(className);
				if (moduleName==null) {
					moduleName = lookupModuleForClass(className, classPackage);
					classModuleNameMap.put(className, moduleName);
				}
				
				if (moduleName!=null && !moduleName.trim().equals("")) {
					return moduleName+"."+className;
				} else {
					return className;
				}
			}
		}
	}
	
	private String lookupModuleForClass(String className, String classPackage) {
		for (String moduleName : modules.keySet()) {
			Module module = modules.get(moduleName);
			if (module.match(className, classPackage)) {
				return moduleName;
			}
		}
		return null;
	}

	private boolean isCommonsClass(String className) {
		return ("Class".equals(className) || "StringBuilder".equals(className)
				 || "DateFormat".equals(className));
	}

	private String getModuleNameForClass(String className) {
		return classModuleNameMap.get(className);
	}

	private List<String> getUsedModuleNames() {
		List<String> usedModulesNames = new ArrayList<String>();
		for (String className : classModuleNameMap.keySet()) {
			String moduleName = classModuleNameMap.get(className);
			if (!usedModulesNames.contains(moduleName)) {
				usedModulesNames.add(moduleName);
			}
		}
		return usedModulesNames;
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

	public static class ContextualizedContent {
		private String content;
		private List<String> usedModuleNames;
		
		public ContextualizedContent(String content, List<String> usedModuleNames) {
			this.content = content;
			this.usedModuleNames = usedModuleNames;
		}

		public String getContent() {
			return content;
		}

		public void setContent(String content) {
			this.content = content;
		}

		public List<String> getUsedModuleNames() {
			return usedModuleNames;
		}

		public void setUsedModuleNames(List<String> usedModuleNames) {
			this.usedModuleNames = usedModuleNames;
		}
	}
}
