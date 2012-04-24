package org.restlet.build.js;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.types.FileSet;
import org.restlet.build.js.ClassContextualizer.ContextualizedContent;

public class ReplaceIncludeTask extends Task {
	private File restletSrcPath;
	private File srcFile;
	private File destFile;
	private String baseDir;
	private boolean contextualize = true;
	private String requirePattern;
	private List<FileSet> filesets = new ArrayList<FileSet>();
	private ClassContextualizer contextualizer;

	public ReplaceIncludeTask() {
		this.contextualizer = new ClassContextualizer();		
	}
	
	public FileSet createFileSet() {
		FileSet fileSet = new FileSet();
		filesets.add(fileSet);
		return fileSet;
	}
	
	private boolean hasSingleBaseDirectory() {
		return (baseDir!=null && filesets==null);
	}
	
	public void execute() throws BuildException {
		if (srcFile==null || !srcFile.exists()) {
			throw new IllegalArgumentException(
					"Source file isn't specified or doesn't exist");
		}
		
		try {
		if (hasSingleBaseDirectory()) {
			doExecuteForSingleBaseDirectory();
		} else {
			doExecuteForMultipleBaseDirectory();
		}
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	private void doExecuteForSingleBaseDirectory() {
		String content = IOUtils.getFileContent(srcFile);
		StringBuilder newContent = new StringBuilder();
		Map<String,String> moduleNames = new HashMap<String, String>();
		
		String currentModuleName = getCurrentModuleName(srcFile.getName());
		
		StringTokenizer st = new StringTokenizer(content, "\n", true);
		while (st.hasMoreTokens()) {
			String line = st.nextToken();
			
			if (line.trim().startsWith("#include ")) {
				String fileToInclude = line.trim().replace("#include ", "").replace("#", "");
				String contentToInclude = IOUtils.getFileContent(baseDir+File.separator+fileToInclude);
				ContextualizedContent cContent = contextualizer.handleFile(fileToInclude, contentToInclude);
				contentToInclude = cContent.getContent();
				List<String> usedModuleNames = cContent.getUsedModuleNames();
				for (String moduleName : usedModuleNames) {
					if (!currentModuleName.equals(moduleName) && moduleNames.get(moduleName)==null) {
						moduleNames.put(moduleName, "");
					}
				}
				if (contentToInclude!=null) {
					newContent.append(contentToInclude);
				} else {
					System.err.println("Unable to retrieve content for include "+fileToInclude);
				}
			} else {
				newContent.append(line);
			}
		}

		StringBuilder requireContent = new StringBuilder();
		if (requirePattern!=null) {
			for (String moduleName : moduleNames.keySet()) {
				requireContent.append(requirePattern.replaceAll("\\{modulename\\}", moduleName));
				requireContent.append("\n");
			}
			if (!requireContent.toString().equals("")) {
				requireContent.append("\n");
			}
		}
		
		IOUtils.setFileContent(destFile, requireContent.toString()+newContent.toString());
	}
	
	private String getCurrentModuleName(String srcFilename) {
		String moduleName = srcFilename;
		if (srcFilename.startsWith("restlet-")) {
			moduleName = moduleName.substring("restlet-".length());
		}
		if (moduleName.endsWith(".js")) {
			moduleName = moduleName.substring(0, moduleName.length()-3);
		}
		return moduleName;
	}

	private String getFileContentFromFilesets(String fileToInclude) {
		for (FileSet fileset : filesets) {
			File fromDir = fileset.getDir(getProject());
			if (fromDir.exists()) {
				File file = new File(fromDir.getAbsoluteFile()+File.separator+fileToInclude);
				if (file.exists()) {
					return IOUtils.getFileContent(file);
				}
			}
		}
		return null;
	}

	private void doExecuteForMultipleBaseDirectory() {
		String content = IOUtils.getFileContent(srcFile);
		StringBuilder newContent = new StringBuilder();
		Map<String,String> moduleNames = new HashMap<String, String>();
		
		String currentModuleName = getCurrentModuleName(srcFile.getName());
		
		StringTokenizer st = new StringTokenizer(content, "\n", true);
		while (st.hasMoreTokens()) {
			String line = st.nextToken();
			
			if (line.trim().startsWith("#include ")) {
				String fileToInclude = line.trim().replace("#include ", "").replace("#", "");
				String contentToInclude = getFileContentFromFilesets(fileToInclude);
				ContextualizedContent cContent = contextualizer.handleFile(fileToInclude, contentToInclude);
				contentToInclude = cContent.getContent();
				List<String> usedModuleNames = cContent.getUsedModuleNames();
				for (String moduleName : usedModuleNames) {
					if (!currentModuleName.equals(moduleName) && moduleNames.get(moduleName)==null) {
						moduleNames.put(moduleName, "");
					}
				}
				if (contentToInclude!=null) {
					newContent.append(contentToInclude);
				} else {
					System.err.println("Unable to retrieve content for include "+fileToInclude);
				}
			} else {
				newContent.append(line);
			}
		}

		StringBuilder requireContent = new StringBuilder();
		if (requirePattern!=null) {
			for (String moduleName : moduleNames.keySet()) {
				requireContent.append(requirePattern.replaceAll("\\{modulename\\}", moduleName));
				requireContent.append("\n");
			}
			if (!requireContent.toString().equals("")) {
				requireContent.append("\n");
			}
		}
		
		IOUtils.setFileContent(destFile, requireContent.toString()+newContent.toString());
	}

	public File getSrcFile() {
		return srcFile;
	}

	public void setSrcFile(File srcFile) {
		this.srcFile = srcFile;
	}

	public File getDestFile() {
		return destFile;
	}

	public void setDestFile(File destFile) {
		this.destFile = destFile;
	}

	public String getBaseDir() {
		return baseDir;
	}

	public void setBaseDir(String baseDir) {
		this.baseDir = baseDir;
	}

	public List<FileSet> getFilesets() {
		return filesets;
	}

	public void setFilesets(List<FileSet> filesets) {
		this.filesets = filesets;
	}

	public File getRestletSrcPath() {
		return restletSrcPath;
	}

	public void setRestletSrcPath(File restletSrcPath) {
		this.restletSrcPath = restletSrcPath;
		if (this.contextualizer!=null) {
			this.contextualizer.setRestletSrcPath(restletSrcPath);
		}
	}

	public boolean isContextualize() {
		return contextualize;
	}

	public void setContextualize(boolean contextualize) {
		this.contextualize = contextualize;
		if (this.contextualizer!=null) {
			this.contextualizer.setContextualize(contextualize);
		}
	}

	public String getRequirePattern() {
		return requirePattern;
	}

	public void setRequirePattern(String requirePattern) {
		this.requirePattern = requirePattern;
	}

}
