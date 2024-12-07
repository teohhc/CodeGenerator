import json
import math
import re

class TreeUtil:
    def __init__(self, futil, trees, rules):
        self.futil = futil
        self.trees = trees
        self.rules = rules

    def padQuote(self, param):
        result = re.sub(r'"',re.escape('\\"'), param)
        result = re.sub(r"'",re.escape("\\'"), result)
        return result
    
    def key_exists(self, my_dict, my_key):
        return my_key in my_dict
        
    def applyUniq(self, uniqRules, idx, subElem, uniqRef, block, evalRules):
        result = True
        checkFlag = False
        if 'Match' in evalRules:
            if isinstance(block, list):
                value = list(block[0].values())[0]
                result = self.checkUniqBlock(uniqRef, value, subElem)
        else:
            if idx in uniqRules:
                rules = uniqRules[idx]
                if subElem in rules:
                    if block in rules[subElem]:
                        checkFlag = True
        if checkFlag:
            evalRules['Match'] = [subElem, block]
        return result, evalRules
    
    def checkUniqBlock(self, uniqRef, block, subElem):
        result = False
        if uniqRef not in self.trees['uniqBlock']:
            self.trees['uniqBlock'][uniqRef]={}
        if block not in self.trees['uniqBlock'][uniqRef]:
            self.trees['uniqBlock'][uniqRef][block] = True
            result = True
        return result
    
    def addToTREE(self, container, idx, args, uniqRef, uniqRules, evalRules):
        maxArgs=len(args)
        if len(args)>idx:
            element = args[idx]
            if isinstance(element, list):
                cnt = 0
                for subElem in element:
                    if isinstance(subElem, dict):
                        key = list(subElem.keys())[0]
                        value = subElem[key]
                        unqResult, evalRules = self.applyUniq(uniqRules, idx, subElem, uniqRef, value, evalRules)
                        if unqResult:
                            container[key]=value
                    else:
                        if not self.key_exists(container, subElem):
                            container[subElem]={}
                        block = args[idx+1]
                        unqResult, evalRules = self.applyUniq(uniqRules, idx, subElem, uniqRef, block, evalRules)
                        evalRules = unqResult['evalRules']
                        if unqResult:
                            container[subElem], evalRules = self.addToTREE(container[subElem], cnt+1, element, uniqRef, uniqRules, evalRules)
            else:
                if not self.key_exists(container, element):
                    container[element]={}
                block = args[idx+1]
                unqResult, evalRules = self.applyUniq(uniqRules, idx, element, uniqRef, block, evalRules)
                if unqResult:
                    container[element], evalRules = self.addToTREE(container[element], idx+1, args, uniqRef, uniqRules, evalRules)
        return container, evalRules
    
    def replacePattern(self, block, from_pat, to_pat, escape=[True, True], DEBUG=False):
        # Use re.sub() to perform the replacement
        #print(json.dumps({
        #    'function':'replacePattern',
        #    'escape':escape,
        #    'block':block,
        #    'from_pat': from_pat,
        #    'to_pat': to_pat
        #}, sort_keys=True, indent=4))
        replaced = ''
        if type(to_pat) is not str:
            to_pat_temp = '{}'.format(to_pat)
            if type(to_pat) is bool:
                to_pat = to_pat_temp.lower()
            else:
                to_pat = to_pat_temp
        if escape[0]:
            param1 = re.escape(from_pat)
        else:
            param1 = from_pat
        if escape[1]:
            param2 = re.escape(to_pat)
        else:
            param2 = to_pat
        if len(escape)>2:
            if escape[2]=="SPECIAL":
                #block = re.sub("\\\\","!SLASH!",block)
                #param1 = re.sub("\\\\","!SLASH!",param1)
                param2 = re.sub("\\\\","!SLASH!",param2)
                replaced = re.sub(param1, param2, block)
                replaced = re.sub("!SLASH!","\\\\", replaced)
        else:
            replaced = re.sub(param1, param2, block)
        if DEBUG:
            print(json.dumps({
                'function':'replacePattern',
                'escape':escape,
                'block':block,
                'from_pat': from_pat,
                'to_pat': to_pat,
                'replaced': replaced,
                'param1':param1,
                'param2':param2
            }, sort_keys=True, indent=4))
        return replaced
    
    def searchPattern(self, block, search_pat):
        searched = re.findall(search_pat, block)
        return searched
    
    def getTemplate(self, codeBlock):
        global TPLTREE
        #TEMPLATELIST = readTemplateSet(codeBlock)
        TEMPLATELIST = self.futil.readSetFromSheet('TemplateSet', 'CodeBlockID', codeBlock)
        #TEMPLATEDIR = readConfigSheet('TemplateDir')['Path'][0]
        #for filename in TEMPLATELIST['Template']:
        evalRules = {}
        for index, row in TEMPLATELIST.iterrows():
            filename = row['TemplateID'].strip()
            physicalfile = row['PhysicalFile'].strip()
            templateblock = row['TemplateBlockID']
            variable = str(row['VariableID']).strip()
            physicaldir = ''
            repo = ''
            if 'PhysicalDir' in row:
                physicaldir = row['PhysicalDir'].strip()
                if len(physicaldir) > 0:
                    physicalfile = "{}/{}".format(physicaldir, physicalfile)
            if 'Repo' in row:
                repo = row['Repo'].strip()
                if len(repo) > 0:
                    physicalfile = "{}/{}".format(repo, physicalfile)
            #addToTPLTREE(physicalfile, templateblock, codeBlock, filename, variable)
            self.trees['TPLTREE'], evalRules = self.addToTREE(self.trees['TPLTREE'], 0, [codeBlock, physicalfile, templateblock, [{'TEMPLATE':filename}, {'VARIABLE':variable}]], 'TPLTREE', self.rules['UNIQ'], evalRules)
    
    def convertDfToJson(self, row, colList, excludeCol):
        result = {}
        for idx, value in enumerate(row):
            if colList[idx] not in excludeCol:
                #print("col[{}]=[{}]".format(collist[idx], value))
                result[colList[idx]]=value
        return result
    
    def handleType(self, data):
        result = ""
        if type(data) is bool:
            if data:
                result = "true"
            else:
                result = "false"
        elif type(data) is float:
            if math.isnan(data):
                result = ""
            elif data:
                result = str(data)
            else:
                result = 0.0
        elif type(data) is int:
            if data:
                result = str(data)
            else:
                result = ""
        elif type(data) is str:
            if data:
                result = str(data)
            else:
                result = ""
        else:
            result = ""
        #print("handleType[{}]data[{}]result[{}]".format(type(data),data,result))
        return result
    
    def getPatMarkers(self, block, pat):
        patMarkers = re.findall(r"{}".format(pat), block)
        #print(json.dumps({'pat':pat,'patMarkers':patMarkers}, sort_keys=True, indent=4))
        result = {}
        for i, patMarker in enumerate(patMarkers):
            #print("-->patMarker :", i, patMarker)
            marker = patMarker.split(':')[1]
            result[marker] = patMarker
        return result
    
    def treatTokenList(self, params):
        #result = json.loads(params)
        result = json.loads(self.rules['LEVEL_3_RULES']['Replace']['FieldDelimiter'](params))
        return result
    
    def resolveParams(self, params):
        #print(json.dumps({
        #    'resolveParams': {
        #        'params':params
        #    }
        #}, sort_keys=True, indent=4))
        #tokenList = json.loads(params[0])
        tokenList = self.treatTokenList(params[0])
        block = params[1]
            
        for pat in self.rules['LEVEL_3_SUB']['Param'].keys():
            extractPatternList = self.getPatMarkers(block, pat)
            if len(extractPatternList):
                #print("-----> resolveParams:[{}]".format(pat))
                #print(json.dumps({
                #    'pat in LEVEL_3_SUB': {
                #        'pattern':pat,
                #        'extractPatternList':extractPatternList,
                #        'tokenList':tokenList
                #    }
                #}, sort_keys=True, indent=4))
                for tokIdx, tok in enumerate(tokenList):
                    strTokIdx = str(tokIdx+1)
                    if strTokIdx in extractPatternList:
                        # Suppress NaN
                        if type(tok) is not str:
                            if math.isnan(tok):
                                tok = ''
                        block = self.rules['LEVEL_3_SUB']['Param'][pat](self, [block, extractPatternList[strTokIdx], tok])
        return block
    
    def resolveReserved(self, mainTree, subTree, mainID, block, extractPatternList, escapeFlag, escapeStmtFlag, DEBUG):
        result = block
        #print("----->resolveReserved:", extractPatternList)
        for pat in extractPatternList:
            RESERVED = pat[0]
            PARAMS = pat[1]
            KV = PARAMS.split(',')
            TYPE = KV[0].strip()
            FIELD = KV[1].strip()
            NUM = KV[2].strip()
            subId = subTree[mainID][TYPE]
            value = self.handleType(mainTree[mainID][TYPE][subId][int(NUM)][FIELD])
    
            if FIELD in self.rules['ESCAPERULE'].keys():
                value = self.rules['ESCAPERULE'][FIELD](self, value)
            #print("subId[{}]NUM[{}]".format(subId, NUM))
            if len(KV) > 3:
                value = self.resolveParams([KV[3], value])
            #print("from[{}]to[{}]".format("{}({})".format(RESERVED, PARAMS), mainTree[mainID][TYPE][subId][int(NUM)][FIELD]))
            if escapeStmtFlag:
                result = self.replacePattern(result, re.escape(re.escape("##{}({})##".format(RESERVED, PARAMS))), value, escapeFlag, DEBUG)
            else:
                result = self.replacePattern(result, re.escape("##{}({})##".format(RESERVED, PARAMS)), value, escapeFlag, DEBUG)
            if DEBUG:
                if KV[0]=="Config" and KV[1]==" ActionRule" and KV[2]==" 1":
                    print(json.dumps({
                        'resolveReserved': {
                            'escapeStmtFlag':escapeStmtFlag,
                            'pat':pat,
                            'KV':KV,
                            'Tree':mainTree[mainID][TYPE][subId][int(NUM)],
                            'result':result
                        }
                    }, sort_keys=True, indent=4))
        return result
    
    def funcNullable(self, param):
        result = param
        if param in self.rules['NULLABLERULE']:
            result = '{}?'.format(param)
        return result
    
    def funcResolvePreserve(self, param):
        result = param[1]
        if len(param[2]) > 0:
            #print(json.dumps({'---> funcResolvePreserve': param }, sort_keys=True, indent=4))
            mainID = param[0]
            block = param[1]
            extractPatternList = param[2]
            regexPat = param[3]
            resolvedStmt={}
            for stmtIdx, pat in enumerate(extractPatternList):
                RESERVED = pat[0]
                PARAMS = pat[1]
                #result = replacePattern(result, "##{}({})##".format(RESERVED, PARAMS), PARAMS, [False, False, "SPECIAL"], True)
                result = self.replacePattern(result, regexPat, PARAMS, [False, False, "SPECIAL"])
        return result
    
    def funcResolveParamDQuote(self, param):
        #print(json.dumps({'---> funcResolveParamDQuote': param }, sort_keys=True, indent=4))
        result = self.replacePattern(param[0], param[1], '\"{}\"'.format(param[2]), [True, False])
        return result
    
    def funcResolveParamDQuoteComma(self, param):
        #print(json.dumps({'---> funcResolveParamDQuoteComma': param }, sort_keys=True, indent=4))
        result = self.replacePattern(param[0], param[1], '\"{}\",'.format(param[2]), [True, False])
        return result
    
    def funcResolveParamComma(self, param):
        #print(json.dumps({'---> funcResolveParamComma': param }, sort_keys=True, indent=4))
        result = self.replacePattern(param[0], param[1], '{},'.format(param[2]), [True, False])
        return result
    
    def funcResolveParam(self, param):
        #print(json.dumps({'---> funcResolveParam': param }, sort_keys=True, indent=4))
        result = self.replacePattern(param[0], param[1], param[2], [False, False])
        return result
    
    def funcResolveComma(self, param):
        #if len(param[2])>0:
        #    print(json.dumps({'---> funcResolveComma': param }, sort_keys=True, indent=4))
        result = self.replacePattern(param[1], param[3], ",", [False, False])
        return result
    
    def resolvePattern(self, block, idList, blockName):
        #print("=====> resolvePattern:")
        result = self.replacePattern(block, self.rules['LEVEL_1_SUB'], blockName)
        for idName, idData  in idList.items():
            if type(idData) is str:
                #print(json.dumps({
                #    'LEVEL_2_SUB': {
                #        'idName':idName,
                #        'idData':idData
                #    }
                #}, sort_keys=True, indent=4))
                for pat in self.rules['LEVEL_2_SUB'][idName]:
                    extractPatternList = self.searchPattern(block, pat)
                    result = self.rules['LEVEL_2_SUB'][idName][pat](self, [idData, result, extractPatternList, pat])
                    #if pat == '##(RESOLVEGRID)\(([^#]+)\)##':
                    #    print("====> resolvePattern:[{}]".format(pat))
                    #    print(json.dumps({
                    #        'pat in LEVEL_2_SUB': {
                    #            'pattern':pat,
                    #            'extractPatternList':extractPatternList,
                    #            'idData':idData,
                    #            'result':result
                    #        }
                    #    }, sort_keys=True, indent=4))
                for pat in self.rules['CONSTANTFUNC']:
                    extractPatternList = self.searchPattern(result, pat)
                    result = self.rules['CONSTANTFUNC'][pat](self, [idData, result, extractPatternList, pat])
        #print(json.dumps({
        #    '-----> resolvePattern:result': result
        #}, sort_keys=True, indent=4))
        return result
    
    def addToMarker(self, container, blockId, marker, pat):
        if (blockId not in container.keys()):
            container[blockId] = {}
        if (marker not in container[blockId].keys()):
            container[blockId][marker] = {}
        container[blockId][marker] = pat
        return container
    
    def getMarkers(self, filename):
        REFERENCEDIR = self.futil.readConfigSheet('ReferenceDir')['Path'][0]
        input_string = self.futil.readFile(REFERENCEDIR, filename)
    
        startMarkers = re.findall(r"{}".format(self.rules['STARTMARKER']), input_string)
        endMarkers = re.findall(r"{}".format(self.rules['ENDMARKER']), input_string)
        #print(json.dumps({'filename':filename,'startMarkers':startMarkers}, sort_keys=True, indent=4))
        #print(json.dumps({'filename':filename,'endMarkers':endMarkers}, sort_keys=True, indent=4))
        result = {}
        for i, (startMarker, endMarker) in enumerate(zip(startMarkers, endMarkers)):
            startBlockId = startMarker.split(':')[2]
            endBlockId = endMarker.split(':')[2]
            #print("-->blockid :", startBlockId, endBlockId)
            result = self.addToMarker(result, startBlockId, 'START', startMarker)
            result = self.addToMarker(result, endBlockId, 'END', endMarker)
        return result
    
    def injectCode(self, filename, blocks):
        markerlist = self.getMarkers(filename)
        #print(json.dumps({'injectcode':{'filename':filename, 'markerlist':markerlist}}, sort_keys=True, indent=4))
        #print(json.dumps(blocks, sort_keys=True, indent=4))
        REFERENCEDIR = self.futil.readConfigSheet('ReferenceDir')['Path'][0]
        input_string = self.futil.readFile(REFERENCEDIR, filename)
        repBlock={}
        for blockId, block in blocks.items():
            para = ""
            newline = ""
            for subBlock, content in block.items():
                # Workaround to clear empty sets
                if bool(content):
                    para = "{}{}{}".format(para,newline,content)
                    newline="\n"
            repBlock[blockId] = para
        for blockId, block in repBlock.items():
            #print("loop: filename[{}] blockId[{}]".format(filename, blockId))
            #if filename == "comparison.component.html" and blockId == 23:
            #    print(json.dumps({
            #        'location':'injectCode-1',
            #        'filename':filename, 'blockId':blockId, 'block':block
            #    }, sort_keys=True, indent=4))
            strBlockId = str(int(float(blockId)))
            if strBlockId in markerlist.keys():
                #print("==========> REPLACE blockId[{}]".format(strBlockId))
                regex = re.compile(r'{}.*{}'.format(
                        re.escape(markerlist[strBlockId]['START']), re.escape(markerlist[strBlockId]['END'])
                    ), flags=re.DOTALL | re.M)
                block = re.sub("\\\\","!SLASH!",block)
                input_string = regex.sub( 
                    r'{}\n{}\n{}'.format(
                        markerlist[strBlockId]['START'],
                        block,
                        markerlist[strBlockId]['END']
                    ), input_string
                )
                #print(filename)
                #if filename == "InetUI/src/app/views/aipm/portfolio/scenario-config/alternate-result/alternate-result.component.ts" and blockId == 9:
                    #print(json.dumps({
                    #    'location':'injectCode-2',
                    #    'filename':filename, 'blockId':blockId, 'block':block, 'input_string':input_string
                    #}, sort_keys=True, indent=4))
                input_string = re.sub("!SLASH!","\\\\",input_string)
                #if filename == "InetUI/src/app/views/aipm/portfolio/scenario-config/alternate-result/alternate-result.component.ts" and blockId == 9:
                #    print("==========> REPLACE blockId[{}]".format(strBlockId))
                #    print("==========> REPLACE [{}]".format(input_string))
                #if filename == "AipmPortfolioResultChartModel.cs": # and blockId == 7:
                #    print(json.dumps({
                #        'location':'injectCode-3',
                #        'filename':filename, 'blockId':blockId, 'block':block, 'input_string':input_string
                #    }, sort_keys=True, indent=4))
            #input_string = regex.sub('xxxxx', input_string)
        #if filename=='comparison.component.ts':
        #    print(json.dumps(markerlist, sort_keys=True, indent=4))
        #    print(json.dumps(repBlock, sort_keys=True, indent=4))
        #    print("============>", filename)
        #print(input_string)
        #print(json.dumps(repBlock, sort_keys=True, indent=4))
        OUTPUTDIR = self.futil.readConfigSheet('OutputDir')['Path'][0]
        self.futil.writeFile(OUTPUTDIR, filename, input_string)
    
    def getReservedToken(self, token, row):
        result = None
        if (token in row.keys()):
            result = row[token]
        return result

    def level3_rep_fd(param):
        return re.sub(':',',',param)
    
    def prepBlock(self, blockName, codeBlock, idList):
        TEMPLATEDIR = self.futil.readConfigSheet('TemplateDir')['Path'][0]
        #for filename, keyData in TPLTREE[codeBlock].items():
        #print(codeBlock)
        for filename, keyData in self.trees['TPLTREE'][codeBlock].items():
            evalRules = {}
            #print(filename)
            for blockId, template in keyData.items():
                #print("blockId[{}]".format(blockId))
                #print("template[{}]".format(template))
                #print(json.dumps({
                #    'blockId': blockId,
                #    'VARIABLE': template['VARIABLE']
                #}, sort_keys=True, indent=4))
                block = self.futil.readFile(TEMPLATEDIR, template['TEMPLATE'], True)
                #block = replacePattern(block, TPLTREE[codeBlock][template][], blockName)
                #newBlock = replacePattern(block, VARTREE[template['VARIABLE'], blockName)
                idList['VariableID'] = template['VARIABLE']
                newBlock = self.resolvePattern(block, idList, blockName)
                #if filename == "InetUI/src/app/views/aipm/portfolio/scenario-config/alternate-result/alternate-result.components.ts" and blockId == 9:
                #    if blockId in [9]:
                #        #print("====> block {} {} [{}]".format(template, blockId, block))
                #        print("----> newBlock {} {} [{}]".format(template, blockId, newBlock))
                #    print(filename, blockId, codeBlock, newBlock)
                #addToBLKTREE(filename, blockId, codeBlock, newBlock)
                self.trees['BLKTREE'], evalRules = self.addToTREE(self.trees['BLKTREE'], 0, [filename, blockId, [{codeBlock:newBlock}]], 'BLKTREE', self.rules['UNIQ'], evalRules)
        return
        
    def getVar(self):
        VARLIST = self.futil.readSheet('Variables')
        evalRules = {}
        for index, row in VARLIST.iterrows():
            self.trees['VARTREE'], evalRules = self.addToTREE(self.trees['VARTREE'], 0, [row['VariableID'], [{row['Num']:row['Token']}]], 'VARTREE', self.rules['UNIQ'], evalRules)

    def funcResolveVar(self, param):
        result = param[1]
        if len(param[2]) > 0:
            #print(json.dumps({'---> funcResolveVar': param }, sort_keys=True, indent=4))
            mainID = param[0]
            block = param[1]
            extractPatternList = param[2]
            regexPat = param[3]
            resolvedStmt={}
            for stmtIdx, pat in enumerate(extractPatternList):
                RESERVED = pat[0]
                PARAMS = pat[1]
                paramList = pat[1].split(",")
                TYPE = paramList[0]
                NUM = paramList[1]
                #print(json.dumps({'---> funcResolveVar:replacePattern': {
                #        'from':"##{}({})##".format(RESERVED, PARAMS),
                #        'to':VARTREE[mainID][int(NUM)]
                #    }              
                #}, sort_keys=True, indent=4))
                result = self.replacePattern(result, "##{}({})##".format(RESERVED, PARAMS), self.trees['VARTREE'][mainID][int(NUM)], [True, False])
        #result = replacePattern(result, param[3], resolvedStmt[mIdx], [True, False])
        return result