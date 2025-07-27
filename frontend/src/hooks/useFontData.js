// src/hooks/useFontData.js
import { useState, useEffect, useCallback } from 'react';
import { fontService, groupService } from '../api/fontService';
import { toast } from 'react-toastify';

export const useFontData = () => {
  const [fonts, setFonts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshFonts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fontService.getFonts();
      setFonts(data);
    } catch (err) {
      setError(err);
      toast.error(`Failed to load fonts: ${err.message}`); // Added toast for loading errors
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (err) {
      setError(err);
      toast.error(`Failed to load groups: ${err.message}`); // Added toast for loading errors
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAllData = useCallback(() => {
    refreshFonts();
    refreshGroups();
  }, [refreshFonts, refreshGroups]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const handleDeleteFont = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this font?')) { // Confirmation added
      try {
        await fontService.deleteFont(id);
        
        setTimeout(() => {
          toast.success('Font deleted successfully!');
        }, 100);
        refreshFonts();
      } catch (err) {
        toast.error(`Failed to delete font: ${err.message}`);
      }
    }
  }, [refreshFonts]);

  const handleDeleteGroup = useCallback(async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the group "${title}"?`)) { // Confirmation added
      try {
        await groupService.deleteGroup(id);
        setTimeout(() => {
          toast.success('Group deleted successfully!');
        }, 100);
        refreshGroups();
      } catch (err) {
        toast.error(`Failed to delete group: ${err.message}`);
      }
    }
  }, [refreshGroups]);

  const handleUploadFont = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('font', file);
    try {
      await fontService.uploadFont(formData);
      setTimeout(() => {
        toast.info('Font uploaded successfully!');
      }, 100);
      refreshFonts();
    } catch (err) {
      toast.error(`Failed to upload font: ${err.message}`);
    }
  }, [refreshFonts]);


  return {
    fonts,
    groups,
    loading,
    error,
    refreshAllData,
    handleDeleteFont,
    handleDeleteGroup,
    handleUploadFont,
  };
};