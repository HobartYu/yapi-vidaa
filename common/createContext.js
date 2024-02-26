module.exports = function (uid, projectId,interfaceId) {
  if(!uid || !projectId || !interfaceId){
    console.error('uid projectId interfaceId cannot empty', uid, projectId,interfaceId)
  }

  /**
   * 统一转换为number
   */
  return {
    uid: +uid,
    projectId: +projectId,
    interfaceId: +interfaceId
  }
}