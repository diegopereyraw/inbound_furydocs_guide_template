const install = function (hook) {

  hook.beforeEach(content => {

    try {

      let contentSections = content.split(/\n\n+/m);

      let fieldTables = []
      let currentFieldTable = null;

      let isInFieldTable = () => {
        return currentFieldTable != null;
      }

      let transitionIn = pos => {
        currentFieldTable = {
          start: pos,
          content: [],
        };
      };

      let transitionOut = pos => {
        currentFieldTable.end = pos - 1;
        fieldTables.push(currentFieldTable);
        currentFieldTable = null;
      };

      let addFieldTableContent = (pos, fieldName, description) => {
        currentFieldTable.content.push({ pos, fieldName, description });
      };

      for (let i = 0; i < contentSections.length; ++i) {

        const re = /^-\s+\*\*(?<fieldName>.+)\*\*\s+\|\s*\n(?<description>(.|\n|\r)*)$/m;
        let m = re.exec(contentSections[i]);

        if (m && !isInFieldTable()) {
          transitionIn(i);
        }

        if (!m && isInFieldTable()) {
          transitionOut(i);
        }

        if (m) {
          addFieldTableContent(i, m.groups.fieldName, m.groups.description)
        }
      }

      if (isInFieldTable()) {
        transitionOut(contentSections.length);
      }

      fieldTables.sort((a, b) => b.start - a.start).forEach(fieldTable => {

        contentSections.splice(fieldTable.end + 1, 0, '</tbody></table>\n\n');

        fieldTable.content.forEach(fieldTableContent => {
          contentSections[fieldTableContent.pos] = '<tr><td style="width:1px; white-space:nowrap; text-align:left;"><b>' +
            fieldTableContent.fieldName + '</b></td><td>' +
            fieldTableContent.description
              .split(/\n|\r/m)
              .map(d => {
                d = d.replace(/(\W)\*\*([^\*]+)\*\*(\W)/gm, "$1<b>$2</b>$3");
                d = d.replace(/(\W)\*([^\*]+)\*(\W)/gm, "$1<i>$2</i>$3");
                return '<p style="margin:0;">' + d + '</p>';
              })
              .join('')
            + '</td></tr>';
        });

        contentSections.splice(fieldTable.start, 0, '<table><tbody>');
      });

      content = contentSections.join('\n\n');
    }
    catch {
    }

    return content;

  });
}

if (!window.$docsify) {
  window.$docsify = {};
}

window.$docsify.plugins = (
  window.$docsify.plugins || []
).concat(install);
