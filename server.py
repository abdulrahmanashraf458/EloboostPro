#!/usr/bin/env python3
import os
import sys
import subprocess
import threading
from flask import Flask, jsonify, request, send_from_directory, make_response, redirect
from flask_cors import CORS
from dotenv import load_dotenv
import importlib.util
import logging
import time
from termcolor import colored

# Setup colored logging system
class ColoredLogger:
    """Custom colored logger to help distinguish different message types"""
    
    # List of static file paths we don't want to log
    IGNORED_PATHS = [
        'favicon.ico', 'manifest.json', 'static/', 'images/', 'logo192.png', 
        'favicon-sw.js', '.js', '.css', '.png', '.jpg', '.svg'
    ]
    
    # Track the last time a message was logged for a path
    last_logged = {}
    
    @staticmethod
    def info(message):
        """Display information message in blue"""
        print(colored(f"[INFO] {message}", 'cyan'))
    
    @staticmethod
    def success(message):
        """Display success message in green"""
        print(colored(f"[SUCCESS] {message}", 'green'))
    
    @staticmethod
    def warning(message):
        """Display warning message in yellow"""
        print(colored(f"[WARNING] {message}", 'yellow'))
    
    @staticmethod
    def error(message):
        """Display error message in red"""
        print(colored(f"[ERROR] {message}", 'red'))
    
    @staticmethod
    def request(method, path, status_code):
        """Display HTTP request info with appropriate color based on status code"""
        # Ignore certain repetitive paths like static files
        if any(path.endswith(ext) for ext in ['.js', '.css', '.png', '.jpg', '.svg']):
            return
            
        if any(ignore in path for ignore in ColoredLogger.IGNORED_PATHS):
            return
        
        # Check time elapsed since last logging of the same path to reduce duplicates
        current_time = time.time()
        path_key = f"{method}:{path}"
        
        # If the same path was logged in the last 5 seconds, ignore it
        if path_key in ColoredLogger.last_logged:
            if current_time - ColoredLogger.last_logged[path_key] < 5:
                return
        
        ColoredLogger.last_logged[path_key] = current_time
        
        # Choose color based on status code
        if 200 <= status_code < 300:
            color = 'green'
            status_text = "OK"
        elif 300 <= status_code < 400:
            color = 'cyan'
            status_text = "REDIRECT"
        elif 400 <= status_code < 500:
            color = 'yellow'
            status_text = "CLIENT ERROR"
        else:
            color = 'red'
            status_text = "SERVER ERROR"
        
        # Display request with consistent, colored formatting
        print(colored(f"[{method}] {path} → {status_code} {status_text}", color))

# Initialize logger
logger = ColoredLogger

# Load configuration file
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.env')
try:
    load_dotenv(dotenv_path)
    logger.info(f"Configuration loaded from {dotenv_path}")
except Exception as e:
    logger.warning(f"Could not load config file: {e}. Using default settings.")

# Server settings
SERVER_HOST = os.getenv('SERVER_HOST', '0.0.0.0')
SERVER_PORT = int(os.getenv('SERVER_PORT', '5000'))
DEBUG_MODE = os.getenv('DEBUG_MODE', 'true').lower() == 'true'
CORS_ALLOW_CREDENTIALS = os.getenv('CORS_ALLOW_CREDENTIALS', 'true').lower() == 'true'

# Setup Flask application
app = Flask(__name__, 
            static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build'),
            static_url_path='')
app.config['JSON_AS_ASCII'] = False
CORS(app, supports_credentials=CORS_ALLOW_CREDENTIALS)

# Check if index.html exists
build_index_path = os.path.join(app.static_folder, 'index.html')
if not os.path.exists(build_index_path):
    logger.error(f"Error: index.html not found at {build_index_path}")
    logger.info(f"Static folder: {app.static_folder}")
    try:
        files = os.listdir(app.static_folder)
        logger.info(f"Files in build directory: {files}")
    except Exception as e:
        logger.error(f"Error listing build directory: {str(e)}")

# Log HTTP requests
@app.after_request
def log_request(response):
    """Log HTTP requests after they are processed"""
    # We don't want to log static file requests to reduce noise
    logger.request(request.method, request.path, response.status_code)
    return response

# Import authentication blueprint
try:
    from backend.auth.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    logger.success("Authentication module loaded successfully")
except Exception as e:
    logger.error(f"Error loading authentication module: {e}")

# Import security blueprint
try:
    from backend.security.api import security_bp, register_security_endpoints
    register_security_endpoints(app)
    logger.success("Security module loaded successfully")
except Exception as e:
    logger.error(f"Error loading security module: {e}")

# API routes
@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from the Flask backend!"})

@app.route('/api/submit-order', methods=['POST'])
def submit_order():
    data = request.json
    return jsonify({"status": "success", "order": data})

# Login routes - important to have these before the catch-all route
@app.route('/api/auth/discord/login')
def discord_login_redirect():
    """Redirect Discord path to Blueprint"""
    return redirect('/api/auth/discord/login')

@app.route('/api/auth/google/login')
def google_login_redirect():
    """Redirect Google path to Blueprint"""
    return redirect('/api/auth/google/login')

# Static file routes - important to have these before the catch-all route
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(app.static_folder, 'static'), filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory(os.path.join(app.static_folder, 'images'), filename)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico')

@app.route('/manifest.json')
def manifest():
    return send_from_directory(app.static_folder, 'manifest.json')

# Handle POST requests
@app.route('/', methods=['POST'])
def handle_root_post():
    """Handle POST requests on the root path"""
    return jsonify({"status": "success", "message": "POST request received"})

@app.route('/<path:path>', methods=['POST'])
def handle_all_posts(path):
    """Handle all unhandled POST requests"""
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found"}), 404
    return jsonify({"status": "success", "message": "POST request received", "path": path})

# Main route for handling React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    """Serve React application"""
    # Handle API requests
    if path.startswith('api/'):
        logger.warning(f"API path not found: {path}")
        return jsonify({"error": "API endpoint not found"}), 404
    
    # Check if the requested file exists (static files)
    full_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(full_path) and os.path.isfile(full_path):
        return send_from_directory(app.static_folder, path)
    
    # For all other routes, serve index.html
    return send_from_directory(app.static_folder, 'index.html')

# Handle 404 errors
@app.errorhandler(404)
def not_found(e):
    # For non-API paths, serve index.html
    if not request.path.startswith('/api/'):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({"error": "Not found"}), 404

def build_frontend():
    """Build React frontend"""
    logger.info("Building React frontend...")
    try:
        npm_cmd = "npm"
        if sys.platform == "win32":
            possible_paths = [
                "npm.cmd", 
                r"C:\Program Files\nodejs\npm.cmd",
                r"C:\Program Files (x86)\nodejs\npm.cmd",
                os.path.expanduser(r"~\AppData\Roaming\npm\npm.cmd")
            ]
            
            for path in possible_paths:
                if os.path.exists(path) or (path == "npm.cmd" and subprocess.run(["where", "npm"], 
                                            stdout=subprocess.PIPE, stderr=subprocess.PIPE).returncode == 0):
                    npm_cmd = path
                    break
        
        logger.info(f"Using npm command: {npm_cmd}")
        
        # Build React app
        subprocess.run([npm_cmd, "run", "build"], check=True)
        logger.success("Frontend build completed successfully!")
    except Exception as e:
        logger.error(f"Error building frontend: {e}")
        logger.warning("You may need to build the frontend manually by running 'npm run build'")

def start_backend():
    """Start Flask server"""
    logger.info("Starting Flask backend server...")
    
    # Create application directories if they don't exist
    os.makedirs('backend', exist_ok=True)
    os.makedirs('backend/auth', exist_ok=True)
    os.makedirs('backend/security', exist_ok=True)
    
    # Create __init__.py files if they don't exist
    if not os.path.exists('backend/__init__.py'):
        with open('backend/__init__.py', 'w') as f:
            f.write('# Backend package initialization')
            
    if not os.path.exists('backend/auth/__init__.py'):
        with open('backend/auth/__init__.py', 'w') as f:
            f.write('# Authentication package initialization')
            
    if not os.path.exists('backend/security/__init__.py'):
        with open('backend/security/__init__.py', 'w') as f:
            f.write('# Security package initialization')
    
    # Start Flask server
    logger.success(f"Server ready at: http://{SERVER_HOST}:{SERVER_PORT}")
    app.run(host=SERVER_HOST, port=SERVER_PORT, debug=DEBUG_MODE, use_reloader=False)

if __name__ == '__main__':
    logger.info("▶️ Starting website (frontend + backend)...")
    
    # Install termcolor if not present
    try:
        import termcolor
    except ImportError:
        logger.warning("Installing termcolor library for colors...")
        subprocess.run([sys.executable, "-m", "pip", "install", "termcolor"], check=True)
        logger.success("termcolor library installed successfully!")
    
    # Build frontend
    build_frontend()
    
    # Start server
    start_backend() 