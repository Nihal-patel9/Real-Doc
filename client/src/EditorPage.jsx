import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';

function EditorPage() {

    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': [] }],
            [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    };



    return (
        <div className="editor-page">
            <div className="navbar">
                <div className="navbar-left">
                    <h1>Untitled document</h1>
                </div>
                <div className="navbar-right">
                    <button className="share-button">Share</button>
                </div>
            </div>
            <div className="toolbar-container">
                <ReactQuill modules={modules} />
            </div>
        </div>
    )
}

export default EditorPage
