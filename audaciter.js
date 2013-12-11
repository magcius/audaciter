(function(exports) {

    function downloadFile(filename, data) {
        var blob = new Blob([data], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);
        var elem = document.createElement('a');
        elem.setAttribute('href', url);
        elem.setAttribute('download', filename);
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }

    function fileSubmitted() {
        var input = document.getElementById('fileupload');
        var file = input.files[0];

        if (!file)
            return false;

        var filename = file.name;
        filename = filename.replace(/\..*$/, '');
        filename = filename + '.srt';

        var reader = new FileReader();
        reader.onload = function() {
            var data = reader.result;
            var srt = labelsToSrt(data);
            downloadFile(filename, srt);
        };
        reader.readAsText(file);
        return false;
    }

    window.onload = function() {
        var form = document.getElementById('uploadform');
        form.onsubmit = fileSubmitted;
    };

})(window);
