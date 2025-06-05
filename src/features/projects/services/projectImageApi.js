import supabase from '../../../lib/supabase';

export const ProjectImageApi = {
  async uploadImage(projectId, file) {
    if (!file) return null;

    const fileExt = file?.name?.split('.').pop();
    const fileName = `${projectId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('project_images')
      .upload(fileName, file);

    if (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }

    return data.path;
  },

  async getImageUrl(imagePath) {
    const { data } = supabase.storage
      .from('project_images')
      .getPublicUrl(imagePath);
    return data.publicUrl;
  },

  async updateProjectImage(projectId, imagePath) {
    const { error } = await supabase
      .from('projects')
      .update({ image: imagePath })
      .eq('id', projectId);

    if (error) {
      throw new Error(`Error updating project image: ${error.message}`);
    }

    return true;
  },

  async updateProject(projectId, projectData) {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', projectId)
      .select();
    
    if (error) throw error;
    return data;
  }
};