'use babel';

import { CompositeDisposable } from 'atom';

export default {

    subscriptions: null,

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'tab-indent-behavior:tab': () => this.indent()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    computeHeadingSpacesRegion(line) {
        const regexpForFirstSpaces = /^\s+/;
        const regexpResult = regexpForFirstSpaces.exec(line);
        if (!regexpResult) {
            return null;
        } else {
            return [regexpResult.index, regexpResult.index + regexpResult[0].length];
        }
    },

    computeShouldMoveToFirstCharacter(cursor, buffer) {
            const cursorPosition = cursor.getBufferPosition();
            const currentColumnPosition = cursorPosition.column;
            const cursorRow = cursor.getBufferRow();
            const currentLine = buffer.lineForRow(cursorRow);
            const currentLineHeadingSpaceRegion = this.computeHeadingSpacesRegion(currentLine);
            if (currentLineHeadingSpaceRegion) {
                const startingPosition = currentLineHeadingSpaceRegion[0];
                const endingPosition = currentLineHeadingSpaceRegion[1];
                if (startingPosition <= currentColumnPosition &&
                    endingPosition > currentColumnPosition) {
                        return true;
                    }
            }
            return false;
    },

    indent() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
            return;
        }

        for (const cursor of editor.getCursors()) {
            const cursorRow = cursor.getBufferRow();
            const shouldMoveToFirstCharacter = this.computeShouldMoveToFirstCharacter(cursor, editor.getBuffer());
            editor.autoIndentSelectedRows(cursorRow);
            if (shouldMoveToFirstCharacter) {
                cursor.moveToFirstCharacterOfLine();
            }
        }
    }
};
