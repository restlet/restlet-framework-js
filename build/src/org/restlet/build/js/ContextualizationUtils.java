package org.restlet.build.js;

import java.io.File;
import java.io.IOException;

public abstract class ContextualizationUtils {

	public static String extractClassNameFromTag(String tag) {
		String className = tag.replace("[class ", "");
		return className.substring(0, className.length()-1);
	}
	
	public static String getClassWithPackage(File restletSrcPath, String className) {
		File targetFile = doGetClassWithPackage(restletSrcPath, className);
		if (targetFile!=null) {
			try {
				System.out.println("file = "+targetFile.getCanonicalPath());
				String targetFilePathName = targetFile.getCanonicalPath();
				String restletSrcPathName = restletSrcPath.getCanonicalPath();
				String classWithPackage = targetFilePathName.replace(restletSrcPathName, "");
				if (classWithPackage.startsWith(File.separator)) {
					classWithPackage = classWithPackage.substring(1);
				}
				classWithPackage = classWithPackage.replaceAll(File.separator, ".");
				return classWithPackage;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return null;
	}

	private static File doGetClassWithPackage(File parent, String className) {
		File[] children = parent.listFiles();
		for (File child : children) {
			if (child.isDirectory()) {
				File ret = doGetClassWithPackage(child, className);
				if (ret!=null) {
					return ret;
				}
			} else {
				if (child.getName().equals(className+".js")) {
					return child;
				}
			}
		}
		return null;
	}

	public static String getPackage(String classNameWithPackage) {
		if (classNameWithPackage.endsWith(".js")) {
			classNameWithPackage = classNameWithPackage.substring(0, classNameWithPackage.length()-4);
		}
		int index = -1;
		if ((index = classNameWithPackage.lastIndexOf("."))!=-1) {
			return classNameWithPackage.substring(0, index);
		} else {
			return "";
		}
	}
}
