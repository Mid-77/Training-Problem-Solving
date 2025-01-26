// نموذج البيانات للرابط
class Link {
    constructor(title, url, category, description, icon, isPaid = false, price = '') {
        this.id = Date.now().toString();
        this.title = title;
        this.url = url;
        this.category = category;
        this.description = description;
        this.icon = icon;
        this.isPaid = isPaid;
        this.price = price;
        this.dateAdded = new Date().toISOString();
    }
}

// مدير الروابط
class LinkManager {
    constructor() {
        this.storageKey = 'trainingLinks';
        this.categories = [
            { name: 'Study Tools', slug: 'study-tools', icon: 'fas fa-book', description: 'أدوات وموارد تساعد في الدراسة والتعلم' },
            { name: 'Developer Tools', slug: 'developer-tools', icon: 'fas fa-tools', description: 'أدوات وبرامج تساعد المطورين في العمل' },
            { name: 'Programming Languages', slug: 'programming-languages', icon: 'fas fa-code', description: 'موارد لتعلم مختلف لغات البرمجة' },
            { name: 'Training & Problem Solving', slug: 'training-problem-solving', icon: 'fas fa-laptop-code', description: 'منصات وموارد للتدريب على حل المشكلات البرمجية' },
            { name: 'Complete Projects', slug: 'complete-projects', icon: 'fas fa-project-diagram', description: 'أمثلة ومشاريع برمجية كاملة للتعلم' },
            { name: 'Algorithms', slug: 'algorithms', icon: 'fas fa-sitemap', description: 'شرح وأمثلة على الخوارزميات المختلفة' },
            { name: 'Data Structures', slug: 'data-structures', icon: 'fas fa-database', description: 'شرح وأمثلة على هياكل البيانات المختلفة' },
            { name: 'Databases', slug: 'databases', icon: 'fas fa-database', description: 'موارد لتعلم قواعد البيانات المختلفة' },
            { name: 'News', slug: 'news', icon: 'fas fa-newspaper', description: 'آخر أخبار عالم التقنية والبرمجة' },
            { name: 'Podcast', slug: 'podcast', icon: 'fas fa-podcast', description: 'بودكاست تعليمي في مجال البرمجة والتقنية' },
            { name: 'YouTube', slug: 'youtube', icon: 'fab fa-youtube', description: 'قنوات يوتيوب تعليمية في مجال البرمجة' },
            { name: 'Platforms', slug: 'platforms', icon: 'fas fa-desktop', description: 'منصات تعليمية متخصصة في البرمجة' }
        ];
        
        // Initialize storage if empty
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Get all categories
    getCategories() {
        return this.categories;
    }

    // Get category by name
    getCategory(name) {
        return this.categories.find(cat => cat.name === name);
    }

    // Get category by slug
    getCategoryBySlug(slug) {
        return this.categories.find(cat => cat.slug === slug);
    }

    // Get all links
    getAllLinks() {
        try {
            const links = localStorage.getItem(this.storageKey);
            return links ? JSON.parse(links) : [];
        } catch (error) {
            console.error('Error getting links:', error);
            return [];
        }
    }

    // Get links by category
    getLinksByCategory(category) {
        try {
            const links = this.getAllLinks();
            return links.filter(link => link.category === category);
        } catch (error) {
            console.error('Error getting links by category:', error);
            return [];
        }
    }

    // Add new link
    addLink(link) {
        try {
            const links = this.getAllLinks();
            const newLink = {
                ...link,
                id: Date.now(),
                dateAdded: new Date().toISOString()
            };
            links.push(newLink);
            localStorage.setItem(this.storageKey, JSON.stringify(links));
            console.log('Link added successfully:', newLink);
            return true;
        } catch (error) {
            console.error('Error adding link:', error);
            return false;
        }
    }

    // Remove link
    removeLink(id) {
        try {
            const links = this.getAllLinks();
            const filteredLinks = links.filter(link => link.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filteredLinks));
            return true;
        } catch (error) {
            console.error('Error removing link:', error);
            return false;
        }
    }

    // Update link
    updateLink(id, updatedLink) {
        try {
            const links = this.getAllLinks();
            const index = links.findIndex(link => link.id === id);
            if (index !== -1) {
                links[index] = { ...links[index], ...updatedLink };
                localStorage.setItem(this.storageKey, JSON.stringify(links));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating link:', error);
            return false;
        }
    }

    // Clear all links
    clearLinks() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
            return true;
        } catch (error) {
            console.error('Error clearing links:', error);
            return false;
        }
    }

    // Get free links
    getFreeLinks() {
        try {
            const links = this.getAllLinks();
            return links.filter(link => !link.isPaid);
        } catch (error) {
            console.error('Error getting free links:', error);
            return [];
        }
    }

    // Get paid links
    getPaidLinks() {
        try {
            const links = this.getAllLinks();
            return links.filter(link => link.isPaid);
        } catch (error) {
            console.error('Error getting paid links:', error);
            return [];
        }
    }
}

// إنشاء واجهة المستخدم للإدارة
class LinkManagerUI {
    constructor(linkManager) {
        this.linkManager = linkManager;
        this.initializeEventListeners();
    }

    // تهيئة مستمعي الأحداث
    initializeEventListeners() {
        const addLinkForm = document.getElementById('addLinkForm');
        if (addLinkForm) {
            addLinkForm.addEventListener('submit', (e) => this.handleAddLink(e));
        }

        const linksList = document.getElementById('linksList');
        if (linksList) {
            linksList.addEventListener('click', (e) => this.handleLinkAction(e));
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterLinks());
        }
    }

    // معالجة إضافة رابط جديد
    handleAddLink(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const linkData = {
            title: formData.get('title'),
            url: formData.get('url'),
            category: formData.get('category'),
            description: formData.get('description'),
            icon: formData.get('icon'),
            isPaid: formData.get('isPaid') === 'true',
            price: formData.get('price')
        };

        this.linkManager.addLink(linkData);

        this.refreshLinksList();
        e.target.reset();

        // إظهار رسالة نجاح
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show mt-3';
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>تم إضافة الرابط بنجاح
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        e.target.appendChild(alert);
    }

    // معالجة أحداث الروابط (حذف، تعديل)
    handleLinkAction(e) {
        if (e.target.matches('.delete-link')) {
            const id = e.target.dataset.id;
            if (confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
                this.linkManager.removeLink(id);
                this.refreshLinksList();
            }
        }
    }

    // تحديث قائمة الروابط في واجهة المستخدم
    refreshLinksList() {
        const linksList = document.getElementById('linksList');
        if (!linksList) return;

        const links = this.linkManager.getAllLinks();
        linksList.innerHTML = links.map(link => this.createLinkElement(link)).join('');
        this.updateCategoryFilter();
    }

    // إنشاء عنصر HTML للرابط
    createLinkElement(link) {
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 platform-card">
                    <div class="card-body">
                        <span class="price-tag">${link.isPaid ? link.price : 'مجاني'}</span>
                        <h3 class="card-title">
                            <a href="${link.url}" target="_blank" class="text-decoration-none">
                                <i class="${link.icon} me-2"></i>${link.title}
                            </a>
                        </h3>
                        <p class="card-text">${link.description}</p>
                        <div class="mt-3 d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">
                                <i class="fas fa-tag me-1"></i>${link.category}
                            </span>
                            <button class="btn btn-danger btn-sm delete-link" data-id="${link.id}">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // تحديث فلتر الفئات
    updateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = this.linkManager.getCategories();
        categoryFilter.innerHTML = `
            <option value="">جميع الفئات</option>
            ${categories.map(category => `
                <option value="${category.slug}">${category.name}</option>
            `).join('')}
        `;
    }

    // فلترة الروابط حسب الفئة
    filterLinks() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const selectedCategory = categoryFilter.value;
        const links = selectedCategory
            ? this.linkManager.getLinksByCategory(this.linkManager.getCategoryBySlug(selectedCategory).name)
            : this.linkManager.getAllLinks();

        const linksList = document.getElementById('linksList');
        if (linksList) {
            linksList.innerHTML = links.map(link => this.createLinkElement(link)).join('');
        }
    }
}

// تهيئة المدير وواجهة المستخدم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const linkManager = new LinkManager();
    const ui = new LinkManagerUI(linkManager);
    ui.refreshLinksList();
});
