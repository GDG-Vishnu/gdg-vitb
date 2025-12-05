/**
 * Cache management for Gallery page
 * Handles caching of gallery images, albums, filters, and user interactions
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Gallery image data
export type GalleryImage = {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  originalUrl: string;
  alt: string;
  photographer?: {
    name: string;
    id?: string;
    avatar?: string;
  };
  uploadedAt: Date;
  takenAt?: Date;
  fileSize: number; // in bytes
  dimensions: {
    width: number;
    height: number;
  };
  format: "JPEG" | "PNG" | "WebP" | "GIF" | "SVG";
  tags: string[];
  category:
    | "EVENT"
    | "TEAM"
    | "WORKSHOP"
    | "MEETING"
    | "HACKATHON"
    | "CONFERENCE"
    | "COMMUNITY"
    | "OTHER";
  eventId?: string;
  albumId?: string;
  isPublic: boolean;
  isFeatured: boolean;
  likes: number;
  views: number;
  downloads: number;
  metadata: {
    camera?: string;
    lens?: string;
    settings?: {
      iso?: number;
      aperture?: string;
      shutterSpeed?: string;
      focalLength?: string;
    };
    location?: {
      name: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
  };
  moderationStatus: "APPROVED" | "PENDING" | "REJECTED";
  downloadCount: number;
  shareCount: number;
};

// Gallery album data
export type GalleryAlbum = {
  id: string;
  title: string;
  description?: string;
  coverImage?: GalleryImage;
  coverImageId?: string;
  imageCount: number;
  totalSize: number; // in bytes
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  category: GalleryImage["category"];
  eventId?: string;
  isPublic: boolean;
  isFeatured: boolean;
  likes: number;
  views: number;
  collaborators: Array<{
    userId: string;
    name: string;
    role: "VIEWER" | "CONTRIBUTOR" | "EDITOR" | "ADMIN";
    addedAt: Date;
  }>;
  settings: {
    allowComments: boolean;
    allowDownloads: boolean;
    showMetadata: boolean;
    requireApproval: boolean;
  };
};

// Gallery filters
export type GalleryFilters = {
  category: GalleryImage["category"] | "ALL";
  dateRange: {
    start?: Date;
    end?: Date;
  };
  tags: string[];
  photographer?: string;
  eventId?: string;
  albumId?: string;
  sortBy:
    | "UPLOAD_DATE"
    | "TAKEN_DATE"
    | "LIKES"
    | "VIEWS"
    | "DOWNLOADS"
    | "TITLE";
  sortOrder: "ASC" | "DESC";
  showOnlyPublic: boolean;
  showOnlyFeatured: boolean;
  format?: GalleryImage["format"];
  minResolution?: {
    width: number;
    height: number;
  };
  maxFileSize?: number; // in MB
};

// User gallery preferences
export type GalleryPreferences = {
  defaultView: "GRID" | "MASONRY" | "LIST" | "CAROUSEL";
  imagesPerPage: number;
  thumbnailSize: "SMALL" | "MEDIUM" | "LARGE";
  showImageInfo: boolean;
  autoPlaySlideshow: boolean;
  slideshowSpeed: number; // in seconds
  enableKeyboardNavigation: boolean;
  downloadQuality: "ORIGINAL" | "HIGH" | "MEDIUM" | "THUMBNAIL";
  favoriteCategories: GalleryImage["category"][];
  recentSearches: string[];
  savedFilters: Array<{
    name: string;
    filters: GalleryFilters;
    createdAt: Date;
  }>;
  darkMode: boolean;
  showMetadata: boolean;
  enableLazyLoading: boolean;
};

// User interactions
export type GalleryInteraction = {
  interactionId: string;
  userId?: string;
  imageId: string;
  albumId?: string;
  type:
    | "VIEW"
    | "LIKE"
    | "UNLIKE"
    | "DOWNLOAD"
    | "SHARE"
    | "COMMENT"
    | "FAVORITE"
    | "UNFAVORITE";
  timestamp: Date;
  metadata?: {
    downloadFormat?: string;
    shareMethod?: string;
    viewDuration?: number; // in seconds
    comment?: string;
  };
  sessionId: string;
};

// Gallery stats
export type GalleryStats = {
  totalImages: number;
  totalAlbums: number;
  totalSize: number; // in bytes
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  recentUploads: number; // last 7 days
  popularImages: Array<{
    imageId: string;
    title: string;
    views: number;
    likes: number;
  }>;
  topCategories: Array<{
    category: GalleryImage["category"];
    count: number;
  }>;
  topPhotographers: Array<{
    photographerId: string;
    name: string;
    imageCount: number;
    totalViews: number;
  }>;
  uploadTrends: Array<{
    date: Date;
    count: number;
  }>;
  lastUpdated: Date;
};

// Cache managers
export const galleryImagesCache = createCacheManager<GalleryImage[]>({
  key: "gdg_gallery_images_v2",
  timestampKey: "gdg_gallery_images_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const galleryAlbumsCache = createCacheManager<GalleryAlbum[]>({
  key: "gdg_gallery_albums_v2",
  timestampKey: "gdg_gallery_albums_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const galleryFiltersCache = createCacheManager<GalleryFilters>({
  key: "gdg_gallery_filters_v2",
  timestampKey: "gdg_gallery_filters_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const galleryPreferencesCache = createCacheManager<GalleryPreferences>({
  key: "gdg_gallery_preferences_v2",
  timestampKey: "gdg_gallery_preferences_timestamp_v2",
  duration: CACHE_DURATIONS.EXTRA_LONG, // 30 minutes (preferences persist)
});

export const galleryInteractionsCache = createCacheManager<
  GalleryInteraction[]
>({
  key: "gdg_gallery_interactions_v2",
  timestampKey: "gdg_gallery_interactions_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes (interactions are real-time)
});

export const galleryStatsCache = createCacheManager<GalleryStats>({
  key: "gdg_gallery_stats_v2",
  timestampKey: "gdg_gallery_stats_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

/**
 * Gallery images cache operations
 */
export const galleryImagesManager = {
  /**
   * Get cached gallery images
   */
  getImages(): GalleryImage[] | null {
    return galleryImagesCache.get({
      fallback: [],
      validator: (data): data is GalleryImage[] =>
        Array.isArray(data) &&
        data.every(
          (image) =>
            typeof image === "object" &&
            image !== null &&
            "id" in image &&
            "title" in image &&
            "url" in image &&
            "category" in image
        ),
    });
  },

  /**
   * Set gallery images to cache
   */
  setImages(images: GalleryImage[]): void {
    galleryImagesCache.set(images);
  },

  /**
   * Get image by ID
   */
  getImageById(imageId: string): GalleryImage | null {
    const images = this.getImages();
    if (!images) return null;

    return images.find((image) => image.id === imageId) || null;
  },

  /**
   * Get images by category
   */
  getImagesByCategory(
    category: GalleryImage["category"]
  ): GalleryImage[] | null {
    const images = this.getImages();
    if (!images) return null;

    return images.filter((image) => image.category === category);
  },

  /**
   * Get images by album
   */
  getImagesByAlbum(albumId: string): GalleryImage[] | null {
    const images = this.getImages();
    if (!images) return null;

    return images.filter((image) => image.albumId === albumId);
  },

  /**
   * Get featured images
   */
  getFeaturedImages(): GalleryImage[] | null {
    const images = this.getImages();
    if (!images) return null;

    return images.filter((image) => image.isFeatured);
  },

  /**
   * Search images
   */
  searchImages(query: string): GalleryImage[] | null {
    const images = this.getImages();
    if (!images) return null;

    const lowerQuery = query.toLowerCase();
    return images.filter(
      (image) =>
        image.title.toLowerCase().includes(lowerQuery) ||
        image.description?.toLowerCase().includes(lowerQuery) ||
        image.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        image.photographer?.name.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filter images
   */
  filterImages(filters: Partial<GalleryFilters>): GalleryImage[] | null {
    const images = this.getImages();
    if (!images) return null;

    let filteredImages = images;

    // Apply category filter
    if (filters.category && filters.category !== "ALL") {
      filteredImages = filteredImages.filter(
        (image) => image.category === filters.category
      );
    }

    // Apply date range filter
    if (filters.dateRange?.start) {
      const startDate = new Date(filters.dateRange.start);
      filteredImages = filteredImages.filter(
        (image) => new Date(image.uploadedAt) >= startDate
      );
    }
    if (filters.dateRange?.end) {
      const endDate = new Date(filters.dateRange.end);
      filteredImages = filteredImages.filter(
        (image) => new Date(image.uploadedAt) <= endDate
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredImages = filteredImages.filter((image) =>
        filters.tags!.some((tag) => image.tags.includes(tag))
      );
    }

    // Apply photographer filter
    if (filters.photographer) {
      filteredImages = filteredImages.filter(
        (image) => image.photographer?.name === filters.photographer
      );
    }

    // Apply event filter
    if (filters.eventId) {
      filteredImages = filteredImages.filter(
        (image) => image.eventId === filters.eventId
      );
    }

    // Apply album filter
    if (filters.albumId) {
      filteredImages = filteredImages.filter(
        (image) => image.albumId === filters.albumId
      );
    }

    // Apply public filter
    if (filters.showOnlyPublic) {
      filteredImages = filteredImages.filter((image) => image.isPublic);
    }

    // Apply featured filter
    if (filters.showOnlyFeatured) {
      filteredImages = filteredImages.filter((image) => image.isFeatured);
    }

    // Apply format filter
    if (filters.format) {
      filteredImages = filteredImages.filter(
        (image) => image.format === filters.format
      );
    }

    // Apply resolution filter
    if (filters.minResolution) {
      filteredImages = filteredImages.filter(
        (image) =>
          image.dimensions.width >= filters.minResolution!.width &&
          image.dimensions.height >= filters.minResolution!.height
      );
    }

    // Apply file size filter
    if (filters.maxFileSize) {
      const maxSizeBytes = filters.maxFileSize * 1024 * 1024; // Convert MB to bytes
      filteredImages = filteredImages.filter(
        (image) => image.fileSize <= maxSizeBytes
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredImages.sort((a, b) => {
        let aVal: any, bVal: any;

        switch (filters.sortBy) {
          case "UPLOAD_DATE":
            aVal = new Date(a.uploadedAt);
            bVal = new Date(b.uploadedAt);
            break;
          case "TAKEN_DATE":
            aVal = a.takenAt ? new Date(a.takenAt) : new Date(0);
            bVal = b.takenAt ? new Date(b.takenAt) : new Date(0);
            break;
          case "LIKES":
            aVal = a.likes;
            bVal = b.likes;
            break;
          case "VIEWS":
            aVal = a.views;
            bVal = b.views;
            break;
          case "DOWNLOADS":
            aVal = a.downloads;
            bVal = b.downloads;
            break;
          case "TITLE":
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === "ASC") {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    return filteredImages;
  },

  /**
   * Update image interactions
   */
  updateImageInteraction(
    imageId: string,
    interactionType: GalleryInteraction["type"]
  ): void {
    galleryImagesCache.update((current) => {
      if (!current) return current || [];

      return current.map((image) => {
        if (image.id !== imageId) return image;

        switch (interactionType) {
          case "LIKE":
            return { ...image, likes: image.likes + 1 };
          case "UNLIKE":
            return { ...image, likes: Math.max(0, image.likes - 1) };
          case "VIEW":
            return { ...image, views: image.views + 1 };
          case "DOWNLOAD":
            return {
              ...image,
              downloads: image.downloads + 1,
              downloadCount: image.downloadCount + 1,
            };
          case "SHARE":
            return { ...image, shareCount: image.shareCount + 1 };
          default:
            return image;
        }
      });
    });
  },

  /**
   * Clear gallery images cache
   */
  clearImages(): void {
    galleryImagesCache.clear();
  },

  /**
   * Check if images cache is valid
   */
  isImagesValid(): boolean {
    return galleryImagesCache.isValid();
  },
};

/**
 * Gallery albums cache operations
 */
export const galleryAlbumsManager = {
  /**
   * Get cached gallery albums
   */
  getAlbums(): GalleryAlbum[] | null {
    return galleryAlbumsCache.get({
      fallback: [],
      validator: (data): data is GalleryAlbum[] =>
        Array.isArray(data) &&
        data.every(
          (album) =>
            typeof album === "object" &&
            album !== null &&
            "id" in album &&
            "title" in album &&
            "imageCount" in album &&
            "category" in album
        ),
    });
  },

  /**
   * Set gallery albums to cache
   */
  setAlbums(albums: GalleryAlbum[]): void {
    galleryAlbumsCache.set(albums);
  },

  /**
   * Get album by ID
   */
  getAlbumById(albumId: string): GalleryAlbum | null {
    const albums = this.getAlbums();
    if (!albums) return null;

    return albums.find((album) => album.id === albumId) || null;
  },

  /**
   * Get albums by category
   */
  getAlbumsByCategory(
    category: GalleryAlbum["category"]
  ): GalleryAlbum[] | null {
    const albums = this.getAlbums();
    if (!albums) return null;

    return albums.filter((album) => album.category === category);
  },

  /**
   * Get featured albums
   */
  getFeaturedAlbums(): GalleryAlbum[] | null {
    const albums = this.getAlbums();
    if (!albums) return null;

    return albums.filter((album) => album.isFeatured);
  },

  /**
   * Search albums
   */
  searchAlbums(query: string): GalleryAlbum[] | null {
    const albums = this.getAlbums();
    if (!albums) return null;

    const lowerQuery = query.toLowerCase();
    return albums.filter(
      (album) =>
        album.title.toLowerCase().includes(lowerQuery) ||
        album.description?.toLowerCase().includes(lowerQuery) ||
        album.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        album.createdBy.name.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Clear gallery albums cache
   */
  clearAlbums(): void {
    galleryAlbumsCache.clear();
  },

  /**
   * Check if albums cache is valid
   */
  isAlbumsValid(): boolean {
    return galleryAlbumsCache.isValid();
  },
};

/**
 * Gallery preferences cache operations
 */
export const galleryPreferencesManager = {
  /**
   * Get cached gallery preferences
   */
  getPreferences(): GalleryPreferences | null {
    return galleryPreferencesCache.get({
      validator: (data): data is GalleryPreferences =>
        typeof data === "object" &&
        data !== null &&
        "defaultView" in data &&
        "imagesPerPage" in data &&
        "thumbnailSize" in data,
    });
  },

  /**
   * Set gallery preferences to cache
   */
  setPreferences(preferences: GalleryPreferences): void {
    galleryPreferencesCache.set(preferences);
  },

  /**
   * Update gallery preferences
   */
  updatePreferences(
    updater: (current: GalleryPreferences | null) => GalleryPreferences
  ): void {
    galleryPreferencesCache.update(updater);
  },

  /**
   * Get preferences with defaults
   */
  getPreferencesWithDefaults(): GalleryPreferences {
    return this.getPreferences() || this.getDefaultPreferences();
  },

  /**
   * Get default preferences
   */
  getDefaultPreferences(): GalleryPreferences {
    return {
      defaultView: "GRID",
      imagesPerPage: 20,
      thumbnailSize: "MEDIUM",
      showImageInfo: true,
      autoPlaySlideshow: false,
      slideshowSpeed: 3,
      enableKeyboardNavigation: true,
      downloadQuality: "HIGH",
      favoriteCategories: [],
      recentSearches: [],
      savedFilters: [],
      darkMode: false,
      showMetadata: false,
      enableLazyLoading: true,
    };
  },

  /**
   * Add recent search
   */
  addRecentSearch(query: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();
      const recentSearches = prefs.recentSearches.filter(
        (search) => search !== query
      );

      return {
        ...prefs,
        recentSearches: [query, ...recentSearches].slice(0, 10), // keep only last 10
      };
    });
  },

  /**
   * Add saved filter
   */
  addSavedFilter(name: string, filters: GalleryFilters): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();

      return {
        ...prefs,
        savedFilters: [
          { name, filters, createdAt: new Date() },
          ...prefs.savedFilters,
        ].slice(0, 20), // keep only last 20
      };
    });
  },

  /**
   * Remove saved filter
   */
  removeSavedFilter(name: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();

      return {
        ...prefs,
        savedFilters: prefs.savedFilters.filter(
          (filter) => filter.name !== name
        ),
      };
    });
  },

  /**
   * Clear gallery preferences cache
   */
  clearPreferences(): void {
    galleryPreferencesCache.clear();
  },

  /**
   * Check if preferences cache is valid
   */
  isPreferencesValid(): boolean {
    return galleryPreferencesCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateGalleryCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Migrate gallery images
      const oldImagesKeys = [
        "gdg_gallery_images_v1",
        "gallery_images_cache",
        "media_gallery_cache",
      ];

      oldImagesKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const images = JSON.parse(oldData) as GalleryImage[];
            galleryImagesManager.setImages(images);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated gallery images cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate gallery images cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate gallery preferences
      const oldPreferencesKeys = [
        "gdg_gallery_preferences_v1",
        "gallery_user_preferences",
        "media_view_preferences",
      ];

      oldPreferencesKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const preferences = JSON.parse(oldData) as GalleryPreferences;
            galleryPreferencesManager.setPreferences(preferences);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated gallery preferences cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate gallery preferences cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Clean up old temporary data
      const oldTempKeys = [
        "gdg_gallery_filters_v1",
        "gdg_gallery_albums_v1",
        "gallery_temp_cache",
        "media_temp_data",
      ];

      oldTempKeys.forEach((oldKey) => {
        localStorage.removeItem(oldKey);
      });
    } catch (error) {
      console.error("Error migrating gallery cache:", error);
    }
  },
};

/**
 * Initialize gallery cache (call this when gallery page loads)
 */
export function initGalleryCache(): void {
  migrateGalleryCache.migrate();
}
