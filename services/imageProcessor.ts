import * as ImageManipulator from 'expo-image-manipulator';

export const ImageProcessor = {
  async prepareForInference(uri: string) {
    try {
      // Resize to 224x224 (common for mobile vision models)
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      return manipulated.uri;
    } catch (e) {
      console.error('Image processing failed', e);
      throw e;
    }
  }
};
