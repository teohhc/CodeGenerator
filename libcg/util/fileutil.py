import pandas as pd
import os
from libcg.util.commentutil import CommentUtil

class FileUtil:
    def __init__(self, cfg, cmntfunct):
        self.cfg = cfg
        self.cmntutil = CommentUtil(cmntfunct)
    
    def readSheet(self, sheetName):
        df = pd.read_excel(self.cfg, sheetName)
        return df
    
    def readConfigSheet(self, token):
        df = pd.read_excel(self.cfg, 'Config')
        #df = readSheet('Config')
        result = df[(df['Variable']==token)].to_dict('list')
        return result
    
    def readSetFromSheet(self, sheet, key, token):
        df = self.readSheet(sheet)
        result = df[(df[key]==token)]
        return result
    
    def readFile(self, path, filename, headerFooterFlag=False):
        try:
            template = open(path + "/" + filename, "r")
        except OSError:
            return ""
        content = template.read()
        if headerFooterFlag:
            data = self.cmntutil.placeComment(filename, content)
        else:
            data = content
        template.close()
        return data
    
    def writeFile(self, path, filename, data):
        os.makedirs(os.path.dirname(path + "/" + filename), exist_ok=True)
        outFile = open(path + "/" + filename, "w")
        outFile.write(data)
        outFile.close()

    def convertDfToJson(self, row, colList, excludeCol):
        result = {}
        for idx, value in enumerate(row):
            if colList[idx] not in excludeCol:
                #print("col[{}]=[{}]".format(collist[idx], value))
                result[colList[idx]]=value
        return result