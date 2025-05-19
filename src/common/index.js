export const isJsonString = (str)=>{
    try {
        JSON.parse(str);
    } catch (e) {
    return false;
    }
    return true;
    }

export const  guessStringType = (str) => {
  if (isJsonString(str)) {
    return "json";
  } else if (isMarkdownString(str)) {
    return "markdown";
  } else {
    return "plain text or other";
  }
}


export  const isMarkdownString = (str)=> {
  // 检查是否存在标题 (h1-h6)
  if (str.startsWith('#') || str.includes('\n#') ||
      str.startsWith('##') || str.includes('\n##') ||
      str.startsWith('###') || str.includes('\n###') ||
      str.startsWith('####') || str.includes('\n####') ||
      str.startsWith('#####') || str.includes('\n#####') ||
      str.startsWith('######') || str.includes('\n######')) {
    return true;
  }

  // 检查是否存在粗体或斜体
  if (str.includes('**') || str.includes('*') || str.includes('__') || str.includes('_')) {
    return true;
  }

  // 检查是否存在列表 (有序或无序)
  if (str.startsWith('- ') || str.includes('\n- ') ||
      str.startsWith('* ') || str.includes('\n* ') ||
      str.startsWith('+ ') || str.includes('\n+ ') ||
      /^\d+\./m.test(str) || /\n\d+\./.test(str)) {
    return true;
  }

  // 检查是否存在链接
  if (str.includes('[') && str.includes('](') && str.includes(')')) {
    return true;
  }

  // 检查是否存在图片
  if (str.includes('![') && str.includes('](') && str.includes(')')) {
    return true;
  }

  // 检查是否存在代码块 (```)
  if (str.includes('```')) {
    return true;
  }

  // 可以添加更多 Markdown 特征的检查

  return false;
}
