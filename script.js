class BlogAdmin {
    constructor() {
        this.isAdmin = false;
        this.currentPostId = null;
        this.posts = [];
        this.config = {
            title: 'Meu Blog',
            primaryColor: '#3498db',
            bgColor: '#f8f9fa'
        };
        this.SENHA_ADMIN = 'admin123'; // MUDE ESSA SENHA!
        this.maxPhotos = 10;
        
        this.init();
    }

    init() {
        this.loadData();
        this.applyConfig();
        this.bindEvents();
        this.renderPublicFeed();
        this.updatePostsList();
    }

    bindEvents() {
        // Admin Login
        document.getElementById('adminBtn').addEventListener('click', () => this.showAdminModal());
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        document.getElementById('closeModal').addEventListener('click', () => this.hideAdminModal());
        document.getElementById('adminPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Admin Panel
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('saveConfigBtn').addEventListener('click', () => this.saveConfig());
        document.getElementById('publishBtn').addEventListener('click', () => this.publishPost());
        document.getElementById('addPhotoBtn').addEventListener('click', () => this.addPhotoInput());

        // Auto-save post content
        document.getElementById('postContent').addEventListener('input', () => {
            if (this.currentPostId) this.autoSavePost();
        });
    }

    showAdminModal() {
        document.getElementById('adminModal').style.display = 'block';
        document.getElementById('adminPassword').focus();
    }

    hideAdminModal() {
        document.getElementById('adminModal').style.display = 'none';
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').textContent = '';
    }

    login() {
        const password = document.getElementById('adminPassword').value;
        if (password === this.SENHA_ADMIN) {
            this.isAdmin = true;
            document.getElementById('adminPanel').classList.remove('hidden');
            document.getElementById('publicFeed').style.display = 'none';
            this.hideAdminModal();
            this.loadEditingPost();
        } else {
            document.getElementById('loginError').textContent = 'Senha incorreta!';
        }
    }

    logout() {
        this.isAdmin = false;
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('publicFeed').style.display = 'flex';
        this.clearEditor();
    }

    saveConfig() {
        this.config.title = document.getElementById('blogTitleInput').value;
        this.config.primaryColor = document.getElementById('primaryColor').value;
        this.config.bgColor = document.getElementById('bgColor').value;
        
        document.documentElement.style.setProperty('--primary-color', this.config.primaryColor);
        document.documentElement.style.setProperty('--bg-color', this.config.bgColor);
        document.getElementById('blogTitle').textContent = this.config.title;
        
        this.saveData();
        this.applyConfig();
    }

    applyConfig() {
        document.documentElement.style.setProperty('--primary-color', this.config.primaryColor);
        document.documentElement.style.setProperty('--bg-color', this.config.bgColor);
        document.getElementById('blogTitle').textContent = this.config.title;
        document.getElementById('blogTitleInput').value = this.config.title;
        document.getElementById('primaryColor').value = this.config.primaryColor;
        document.getElementById('bgColor').value = this.config.bgColor;
    }

    async publishPost() {
        const content = document.getElementById('postContent').value.trim();
        if (!content) {
            alert('Escreva algo no post!');
            return;
        }

        const photoFiles = Array.from(document.querySelectorAll('input[type="file"]'))
            .map(input => input.files[0])
            .filter(file => file);

        if (photoFiles.length > this.maxPhotos) {
            alert(`Máximo de ${this.maxPhotos} fotos!`);
            return;
        }

        const photoUrls = await this.uploadPhotos(photoFiles);
        
        const post = {
            id: Date.now().toString(),
            content: content,
            photos: photoUrls,
            date: new Date().toISOString(),
            edited: false
        };

        this.posts.unshift(post);
        this.saveData();
        this.clearEditor();
        this.renderPublicFeed();
        this.updatePostsList();
        
        alert('Post publicado com sucesso! ✅');
    }

    async uploadPhotos(files) {
        const urls = [];
        for (let file of files) {
            urls.push(await this.toBase64(file));
        }
        return urls;
    }

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        this.currentPostId = id;
        document.getElementById('postContent').value = post.content;
        
        // Recriar photo inputs
        const photoContainer = document.getElementById('photoInputs');
        photoContainer.innerHTML = '';
        post.photos.forEach((photo, index) => {
            this.createPhotoInput(photo, index);
        });

        document.getElementById('publishBtn').textContent = 'Atualizar Post';
        document.getElementById('publishBtn').innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar Post';
    }

    deletePost(id) {
        if (confirm('Tem certeza que quer deletar este post?')) {
            this.posts = this.posts.filter(p => p.id !== id);
            this.saveData();
            this.renderPublicFeed();
            this.updatePostsList();
            if (this.currentPostId === id) {
                this.clearEditor();
            }
        }
    }

    clearEditor() {
        this.currentPostId = null;
        document.getElementById('postContent').value = '';
        document.getElementById('photoInputs').innerHTML = `
            <input type="file" id="photo1" accept="image/*" multiple>
        `;
        document.getElementById('publishBtn').textContent = 'Publicar Post';
        document.getElementById('publishBtn').innerHTML = '<i class="fas fa-paper-plane"></i> Publicar Post';
        this.addPhotoInput();
    }

    autoSavePost() {
        if (this.currentPostId) {
            const post = this.posts.find(p => p.id === this.currentPostId);
            if (post) {
                post.content = document.getElementById('postContent').value;
                post.edited = true;
                this.saveData();
            }
        }
    }

    loadEditingPost() {
        // Carrega o último post para edição
        if (this.posts.length > 0) {
            this.editPost(this.posts[0].id);
        }
    }

    addPhotoInput() {
        const photoInputs = document.querySelectorAll('input[type="file"]');
        if (photoInputs.length >= this.maxPhotos) {
            alert(`Máximo de ${this.maxPhotos} fotos!`);
            return;
        }

        const photoContainer = document.getElementById('photoInputs');
        const newInput = document.createElement('input');
        newInput.type = 'file';
        newInput.accept = 'image/*';
        newInput.id = `photo${photoInputs.length + 1}`;
        photoContainer.appendChild(newInput);
    }

    createPhotoInput(photoUrl = null, index = 0) {
        const photoContainer = document.getElementById('photoInputs');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.id = `photo${index + 1}`;
        if (photoUrl) {
            // Criar preview da foto existente
            const preview = document.createElement('img');
            preview.src = photoUrl;
            preview.style.width = '60px';
            preview.style.height = '60px';
            preview.style.objectFit = 'cover';
            preview.style.borderRadius = '8px';
            preview.style.marginRight = '10px';
            input.parentNode.insertBefore(preview, input);
        }
        photoContainer.appendChild(input);
    }

    updatePostsList() {
        const container = document.getElementById('postsList');
        container.innerHTML = '';

        this.posts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post-item';
            postEl.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 0.5rem;">${new Date(post.date).toLocaleDateString('pt-BR')}</div>
                <div style="font-size: 14px; color: #666; margin-bottom: 1rem;">${post.content.substring(0, 100)}...</div>
                ${post.photos.length > 0 ? `<img src="${post.photos[0]}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` : ''}
                <div class="post-actions">
                    <button class="btn-secondary" onclick="blog.editPost('${post.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-primary delete-btn" onclick="blog.deletePost('${post.id}')">
                        <i class="fas fa-trash"></i> Deletar
                    </button>
                </div>
            `;
            container.appendChild(postEl);
        });
    }

    renderPublicFeed() {
        const container = document.getElementById('postsFeed');
        container.innerHTML = '';

        this.posts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post-card';
            postEl.innerHTML = `
                ${post.photos.length > 0 ? `
                <div class="post-slider">
                    ${post.photos.map((photo, index) => `
                        <img src="${photo}" class="slider-image ${index === 0 ? 'active' : ''}" alt="Foto ${index + 1}">
                    `).join('')}
                    ${post.photos.length > 1 ? `
                    <button class="slider-nav slider-prev" onclick="blog.prevSlide(this)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="slider-nav slider-next" onclick="blog.nextSlide(this)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    ` : ''}
                </div>
                ` : ''}
                <div class="post-content">
                    <div class="post-text">${this.formatContent(post.content)}</div>
                    <div style="margin-top: 1.5rem; font-size: 0.9rem; color: #888;">
                        ${new Date(post.date).toLocaleDateString('pt-BR')} ${post.edited ? '✏️ Editado' : ''}
                    </div>
                </div>
            `;
            container.appendChild(postEl);
        });
    }

    formatContent(content) {
        // Suporte básico a formatação Markdown/HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    prevSlide(slider) {
        const images = slider.parentNode.querySelectorAll('.slider-image');
        const current = slider.parentNode.querySelector('.active');
        const currentIndex = Array.from(images).indexOf(current);
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        
        current.classList.remove('active');
        images[prevIndex].classList.add('active');
    }

    nextSlide(slider) {
        const images = slider.parentNode.querySelectorAll('.slider-image');
        const current = slider.parentNode.querySelector('.active');
        const currentIndex = Array.from(images).indexOf(current);
        const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        
        current.classList.remove('active');
        images[nextIndex].classList.add('active');
    }

    saveData() {
        const data = {
            posts: this.posts,
            config: this.config,
            version: '1.0'
        };
        localStorage.setItem('blogData', JSON.stringify(data));
    }

    loadData() {
        const data = localStorage.getItem('blogData');
        if (data) {
            const parsed = JSON.parse(data);
            this.posts = parsed.posts || [];
            this.config = { ...this.config, ...parsed.config };
        }
    }
}

// Inicializar quando a página carregar
const blog = new BlogAdmin();