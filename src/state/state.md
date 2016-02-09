We have several different notions of state, with different lifecycles on each.

The Lab has a number of open "documents".  A document is represented by a top-level widget in the dock area (but possibly not all top-level widgets are documents - we could tear off a part of a document to make a top-level widget in the dock area that is a part of a document...).  Examples of documents include any file that is represented, as well as terminals, chat windows, real-time video conferences, etc.

Lab IDE Session state
=====================

Plugins should be able to read/write slices of the IDE state. This IDE state should be preserved on refresh, so a Lab IDE session id should be stored in the URL and the state periodically synced to the server.

Initial implementation could be a local storage solution, tied to the URL.  When the lab starts up, it randomly appends a session id, and then stores session information in local storage tied to the url.  In general, the lab would ask the server for a session id if one is not provided?

Question: on a refresh, should Lab IDE session state only inform the initial setup of the environment (and then the URL changes to reflect a new lab sesion id), or should we try to keep two lab sessions in sync, so if you change the dock layout in one browser window, the dock layout in the other browser changes automatically? Or should we make it easy for a user to 'clone' a lab session?   

A new plugin, the LabSessionManager plugin, will change the URL to the lab session id and create a lab session store. Other plugins can resolve this plugin and use it to request keys with initial values. They then can set themselves up according to the values in the lab session, and register for change notifications of the lab session values. As they request modifications of the lab session state, the state is synced somewhere (localstorage in the initial implementation).

Dock panel
----------
- Window arrangement of documents, side-panels, etc.

DocumentManager
---------------
- What documents are open (i.e., what document sessions we are talking with)

FileBrowser
-----------
- Currently open directory in file browser

Individual documents
--------------------
- ephemeral editing state, like code folding, etc?

Document session state
======================
Document session state is shared among everyone that has the document open, and corresponds to sharing a kernel. This state should not be reflected in the URL, but should be retrievable given a path to a document. This corresponds to the existing notion of a notebook session, but is more broad, since it encompasses other types of documents, like text documents, terminals, etc.

Some possible state includes:
- current contents of document
- cursor positions of editors
- notebook ipywidget values


User session state
==================
The user state is linked to the user authentication (if any), or uses the config rest api to store values "system-wide" for setups without user authentication

User state includes:
- Preferences for syntax highlighting, editor options, etc.
- User information (e.g., username, etc.?)
- Quick palettes the user sets up

Further notes
=============

Document sessions and Lab sessions are many-to-many: a document session may be open in many lab sessions, and a lab session may contain many document sessions.
