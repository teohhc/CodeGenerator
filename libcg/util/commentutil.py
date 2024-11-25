class CommentUtil:
    def __init__(self, cmntfunct):
        self.cmntfunct = cmntfunct
        
    def commentSlash(text):
        return '''\n//===============================================================\n// {}\n//===============================================================\n'''.format(text)
    
    def commentHTML(text):
        return '''\n<!--===============================================================\n// {}\n===============================================================-->\n'''.format(text)

    def placeComment(self, filename, content):
        EXT = filename.split('.')[1].upper()
        EXT2 = filename.split('.')[2].upper()
        # Patch for filename like portfolio.interface.ts.1.1.tpl
        if EXT not in self.cmntfunct:
            if EXT2 in self.cmntfunct:
                EXT = EXT2
        #print('placeComment()', filename, EXT)
        if EXT in self.cmntfunct:
            header = self.cmntfunct[EXT]('TEMPLATE START: {}'.format(filename))
            footer = self.cmntfunct[EXT]('TEMPLATE END: {}'.format(filename))
            return '''{}{}{}'''.format(header, content, footer)
        else:
            return content