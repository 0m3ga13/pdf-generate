import React from 'react';
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';

const DocxGen = ({ formData }) => {

    const generateDocx = async () => {
        try {
            // Load your DOCX template file (template.docx) using fetch or from a static file
            const response = await fetch('');
            const templateBuffer = await response.arrayBuffer();

            // Create a new instance of docxtemplater
            const doc = new Docxtemplater();
            doc.loadZip(templateBuffer);

            // Set data to fill the template
            doc.setData({
                date: formData.date,
                president: formData.president,
                members: formData.members.map(member => member.name),
                // Add more data fields as needed
            });

            // Render the document (generate DOCX)
            doc.render();

            // Get the generated DOCX as an ArrayBuffer
            const generatedDocArrayBuffer = doc.getZip().generate({ type: 'arraybuffer' });

            // Save the generated DOCX file using file-saver
            const blob = new Blob([generatedDocArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            saveAs(blob, 'generated_document.docx');
        } catch (error) {
            console.error('Error generating document:', error);
        }
    };

    return (
        <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button" onClick={generateDocx}>
            Generate DOCX
        </button>
    );
};

export default DocxGen;
