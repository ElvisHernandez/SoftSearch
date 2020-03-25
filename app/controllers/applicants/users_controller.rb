class Applicants::UsersController < Applicants::UserBaseController
  before_action :is_current_user
  skip_before_action :verify_authenticity_token

  def index
    user_id = params['user_id']
    @user_favorites = User.find(user_id).user_favorites
  end

  def create

    if(!%i[jobId user_id].all? { |s| params.has_key? s })
      return
    end
    job_id = params['jobId']
    user_id = params['user_id']
    user_favorite = UserFavorite.create(user_id: user_id, job_id: job_id)

    render json: { favoriteId: user_favorite['id'] }
  end

  def get_all_favs
    user_id = params['user_id']
    user_favorites = UserFavorite.where(user_id: user_id)

    render json: { userFavorites: user_favorites }
  end
    
  def destroy
    job_id = params['jobId']
    user_id = params['user_id']

    user_favorite = UserFavorite.where(user_id: user_id, job_id: job_id)[0]
    if(user_favorite)
      user_favorite.destroy
      redirect_to "/applicants/users/#{user_id}/favorites"
    else
      return
    end
  end
  
  private
  
  def job_params
      params.require(:user_favorite).permit(:user_id, :job_id)
  end
    
  def is_current_user
    user_url_id = params['user_id'].to_i
    unless current_user.id == user_url_id
        redirect_to root_path
    end
  end
end
