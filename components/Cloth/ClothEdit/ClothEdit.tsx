import React from 'react'
import { Edit, useNotify, useRedirect } from 'react-admin'
import { CLOTH_SOURCE_NAME } from '../../../constants/sourceNames'
import { useGoodsEdition } from '../../../hooks/useGoodsEdition'
import { EditTopToolbar } from '../../elements/EditTopToolbar/EditTopToolbar'
import { ClothForm } from '../ClothForm/ClothForm'
import { getImagesFromRawFile } from '../../../utils/dataProvider'

export const ClothEdit = () => {
  const {
    type,
    handleSelectType,
    maxImagesCount,
    handleClone,
    cloneProductSpinner,
  } = useGoodsEdition(CLOTH_SOURCE_NAME)

  const notify = useNotify()
  const redirect = useRedirect()

  /**
   * Преобразует данные перед отправкой на сервер
   * Особое внимание уделяет обработке изображений
   */
  const transformData = async (data: any) => {
    try {
      // Если есть изображения, обрабатываем их
      if (data.images && Array.isArray(data.images)) {
        const processedImages = await getImagesFromRawFile(data.images)
        return {
          ...data,
          images: processedImages.map(img => ({
            url: img.url,
            title: img.title || 'Изображение товара'
          }))
        }
      }
      return data
    } catch (error) {
      notify('Ошибка при обработке изображений', { type: 'error' })
      throw error // Прерываем сохранение формы
    }
  }

  /**
   * Обработчик успешного сохранения
   */
  const onSuccess = (data: any) => {
    notify(`Товар "${data.name}" успешно обновлен`, { type: 'success' })
    redirect('list', data.id) // Перенаправляем к списку с сохранением id
  }

  /**
   * Обработчик ошибки сохранения
   */
  const onError = (error: any) => {
    notify(`Ошибка при сохранении: ${error.message}`, { type: 'error' })
  }

  return (
    <Edit
      actions={
        <EditTopToolbar
          handleClone={handleClone}
          spinner={cloneProductSpinner}
        />
      }
      transform={transformData}
      mutationOptions={{ 
        onSuccess,
        onError 
      }}
    >
      <ClothForm
        type={type}
        handleSelectType={handleSelectType}
        maxImagesCount={maxImagesCount}
      />
    </Edit>
  )
}