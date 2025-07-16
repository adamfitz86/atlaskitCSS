# AtlasKit Notes

A beautiful, responsive note-taking web application built with Atlassian's AtlasKit CSS framework. Create, organize, and manage your notes with a professional Atlassian-style interface.

![AtlasKit Notes Preview](https://img.shields.io/badge/Built%20with-AtlasKit%20CSS-0052CC?style=for-the-badge&logo=atlassian)

## Features

### 📝 Note Management
- **Create Notes**: Add notes with titles, content, and categories
- **Edit Notes**: Modify existing notes with an intuitive modal interface
- **Delete Notes**: Remove notes with confirmation prompts
- **Pin Notes**: Keep important notes at the top of your list

### 🔍 Organization & Search
- **Categories**: Organize notes by Work, Personal, Ideas, To-Do, or General
- **Search**: Find notes by title or content with real-time highlighting
- **Filter**: View notes by specific categories
- **Statistics**: Track total notes, pinned notes, and category breakdowns

### 💾 Data Management
- **Local Storage**: All notes are saved locally in your browser
- **Export**: Download all notes as a JSON file for backup
- **Persistence**: Notes are automatically saved and restored between sessions

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **AtlasKit Styling**: Professional Atlassian design system
- **Keyboard Shortcuts**: Quick access with Ctrl/Cmd+N (new note), Ctrl/Cmd+F (search)
- **Notifications**: Visual feedback for all actions
- **Tooltips**: Helpful hints throughout the interface

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Installation
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start taking notes immediately!

### File Structure
```
AtlasKitCss/
├── index.html          # Main application HTML
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
├── README.md           # This file
└── .github/
    └── copilot-instructions.md
```

## Usage

### Creating a Note
1. Fill in the "Note Title" field
2. Select a category from the dropdown
3. Write your note content in the text area
4. Optionally check "Pin this note to top"
5. Click "Add Note"

### Managing Notes
- **Edit**: Click the edit icon (pencil) on any note
- **Delete**: Click the delete icon (trash) on any note
- **Search**: Use the search box to find specific notes
- **Filter**: Select a category to view only those notes

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Focus on new note title field
- `Ctrl/Cmd + F`: Focus on search field
- `Escape`: Close edit modal

## Technical Details

### Built With
- **HTML5**: Semantic markup structure
- **AtlasKit CSS**: Atlassian's design system CSS framework
- **Vanilla JavaScript**: Modern ES6+ features, no frameworks
- **Local Storage API**: Browser-based data persistence

### AtlasKit Components Used
- Grid system for responsive layout
- Form elements (text inputs, textareas, selects, buttons)
- Checkbox and toggle components
- Icon system with SVG sprites
- Color scheme and typography standards

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Adding New Categories
Edit the category options in both the main form and edit modal in `index.html`:
```html
<option value="your-category">Your Category</option>
```

Add corresponding CSS styling in `styles.css`:
```css
.note-category.your-category { 
    background: #YOUR_COLOR; 
    color: #TEXT_COLOR; 
}
```

### Modifying Styles
The app uses AtlasKit CSS as the foundation. Custom styles in `styles.css` can be modified to:
- Change color schemes
- Adjust spacing and layout
- Modify animations and transitions
- Update responsive breakpoints

### Extending Functionality
The JavaScript is modular and easy to extend. Common modifications:
- Add new note fields (tags, priority, etc.)
- Implement note sharing features
- Add import functionality
- Create note templates

## Data Format

Notes are stored in the following JSON structure:
```json
{
  "id": "unique-timestamp",
  "title": "Note Title",
  "content": "Note content...",
  "category": "work",
  "isPinned": false,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## Contributing

This is a simple, standalone web application. Feel free to:
1. Fork the repository
2. Make your changes
3. Submit a pull request

### Development Guidelines
- Maintain AtlasKit design consistency
- Follow the existing code style
- Test across different browsers
- Ensure responsive design works
- Add comments for complex logic

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Atlassian** for the amazing AtlasKit CSS framework
- **AtlasKit CSS** for providing a comprehensive design system
- The Atlassian design team for creating beautiful, accessible components

## Support

If you encounter any issues or have feature requests:
1. Check the browser console for errors
2. Ensure you're using a supported browser
3. Try clearing browser data and refreshing
4. Open an issue in the repository

---

**Happy Note Taking!** 📝✨
