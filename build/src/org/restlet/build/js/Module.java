package org.restlet.build.js;

import java.util.List;

public class Module {
	private String name;
	private List<String> packages;
	private List<String> excludeClasses;
	private List<String> includeClasses;

	public Module(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<String> getPackages() {
		return packages;
	}
	public void setPackages(List<String> packages) {
		this.packages = packages;
	}
	public List<String> getExcludeClasses() {
		return excludeClasses;
	}
	public void setExcludeClasses(List<String> excludeClasses) {
		this.excludeClasses = excludeClasses;
	}
	public List<String> getIncludeClasses() {
		return includeClasses;
	}
	public void setIncludeClasses(List<String> includeClasses) {
		this.includeClasses = includeClasses;
	}
	public boolean match(String className, String classPackage) {
		String completeClassName = classPackage+"."+className;
		for (String packageName : packages) {
			if (packageName.equals(classPackage)) {
				boolean foundExclude = false;
				if (excludeClasses!=null) {
					for (String excludeName : excludeClasses) {
						if (excludeName.equals(completeClassName)) {
							foundExclude = true;
							break;
						}
					}
				}
				if (!foundExclude) {
					return true;
				}
			} else {
				if (includeClasses!=null) {
					for (String includeName : includeClasses) {
						if (includeName.equals(completeClassName)) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
}
